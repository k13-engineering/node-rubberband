import { RubberBandInterface } from "rubberband-wasm";
import { loadRubberbandWasm } from "./rubberband.ts";
import { optionsToBitmask, type TRubberbandOptions } from "./options.ts";

type TRubberbandAudioData = {
  planes: Float32Array[];
};

const rubberbandWasm = await loadRubberbandWasm();

const wasm = await WebAssembly.compile(rubberbandWasm);
const rubberbandApi = await RubberBandInterface.initialize(wasm);

// eslint-disable-next-line max-statements
const createRubberbandWrapper = ({
  sampleRate,
  channelCount,
  maxBufferSizeInFrames,
  options
}: {
  sampleRate: number;
  channelCount: number;
  maxBufferSizeInFrames: number;
  options: Partial<TRubberbandOptions>;
}) => {

  let ended = false;

  const channelArrayPtr = rubberbandApi.malloc(channelCount * 4);
  const channelDataPtrs: number[] = [];
  for (let channel = 0; channel < channelCount; channel += 1) {
    const bufferPtr = rubberbandApi.malloc(maxBufferSizeInFrames * 4);
    channelDataPtrs.push(bufferPtr);
    rubberbandApi.memWritePtr(channelArrayPtr + channel * 4, bufferPtr);
  }

  const optionsBitmask = optionsToBitmask({ options });
  const rb = rubberbandApi.rubberband_new(sampleRate, channelCount, optionsBitmask, 1, 1);

  if (rb === 0) {
    throw Error("failed to create rubberband instance");
  }

  const requestPitchScale = ({ pitchScale }: { pitchScale: number }) => {
    rubberbandApi.rubberband_set_pitch_scale(rb, pitchScale);
  };

  const requestTimeRatio = ({ timeRatio }: { timeRatio: number }) => {
    rubberbandApi.rubberband_set_time_ratio(rb, timeRatio);
  };

  const samplesRequired = () => {
    return rubberbandApi.rubberband_get_samples_required(rb);
  };

  const process = ({ audioData }: { audioData: TRubberbandAudioData }) => {
    if (ended) {
      throw Error("already ended");
    }

    const firstPlane = audioData.planes[0];
    const sampleCount = firstPlane.length;

    audioData.planes.forEach((plane, channelIndex) => {

      if (plane.length > maxBufferSizeInFrames) {
        throw new Error("plane length exceeds max buffer size");
      }

      if (plane.length !== sampleCount) {
        throw new Error("all planes must have the same length");
      }

      const channelDataPtr = channelDataPtrs[channelIndex];
      rubberbandApi.memWrite(channelDataPtr, plane);
    });

    rubberbandApi.rubberband_process(rb, channelArrayPtr, sampleCount, 0);
  };

  const end = () => {
    if (ended) {
      throw Error("already ended");
    }

    ended = true;
    rubberbandApi.rubberband_process(rb, channelArrayPtr, 0, 1);
  };

  const available = (): number => {
    return rubberbandApi.rubberband_available(rb);
  };

  const latencyInSamples = (): number => {
    return rubberbandApi.rubberband_get_latency(rb);
  };

  // eslint-disable-next-line complexity
  const retrieve = ({ sampleCount }: { sampleCount: number }): TRubberbandAudioData => {

    if (sampleCount > maxBufferSizeInFrames) {
      throw Error(`requested sample count ${sampleCount} exceeds max buffer size ${maxBufferSizeInFrames}`);
    }

    if (sampleCount > available()) {
      throw Error(`look before you leap: requested ${sampleCount} samples but only ${available()} available`);
    }

    const samplesReceived = rubberbandApi.rubberband_retrieve(rb, channelArrayPtr, sampleCount);

    if (samplesReceived > sampleCount) {
      throw Error("BUG: received more samples than requested");
    }

    if (samplesReceived < sampleCount) {
      throw Error("BUG: received fewer samples than requested");
    }

    let planes: Float32Array[] = [];

    channelDataPtrs.forEach((channelDataPtr) => {
      // memReadF32 returns a view of the WASM memory, so we need to copy it out
      const stolenPlane = rubberbandApi.memReadF32(channelDataPtr, samplesReceived);

      const plane = new Float32Array(samplesReceived);
      plane.set(stolenPlane);

      planes = [...planes, plane];
    });

    return {
      planes
    };
  };

  return {
    requestPitchScale,
    requestTimeRatio,
    samplesRequired,
    process,
    end,
    available,
    latencyInSamples,
    retrieve
  };
};

type TRubberbandWrapper = ReturnType<typeof createRubberbandWrapper>;

export {
  createRubberbandWrapper
};

export type {
  TRubberbandWrapper
};
