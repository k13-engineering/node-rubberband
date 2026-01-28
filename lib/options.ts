const OptionProcessOffline = 0x00000000;
const OptionProcessRealTime = 0x00000001;
const OptionStretchElastic = 0x00000000;
const OptionStretchPrecise = 0x00000010;
const OptionTransientsCrisp = 0x00000000;
const OptionTransientsMixed = 0x00000100;
const OptionTransientsSmooth = 0x00000200;
const OptionDetectorCompound = 0x00000000;
const OptionDetectorPercussive = 0x00000400;
const OptionDetectorSoft = 0x00000800;
const OptionPhaseLaminar = 0x00000000;
const OptionPhaseIndependent = 0x00002000;
const OptionThreadingAuto = 0x00000000;
const OptionThreadingNever = 0x00010000;
const OptionThreadingAlways = 0x00020000;
const OptionWindowStandard = 0x00000000;
const OptionWindowShort = 0x00100000;
const OptionWindowLong = 0x00200000;
const OptionSmoothingOff = 0x00000000;
const OptionSmoothingOn = 0x00800000;
const OptionFormantShifted = 0x00000000;
const OptionFormantPreserved = 0x01000000;
const OptionPitchHighSpeed = 0x00000000;
const OptionPitchHighQuality = 0x02000000;
const OptionPitchHighConsistency = 0x04000000;
const OptionChannelsApart = 0x00000000;
const OptionChannelsTogether = 0x10000000;
const OptionEngineFaster = 0x00000000;
const OptionEngineFiner = 0x20000000;

type TRubberbandOptions = {
  processMode: "realtime" | "offline";
  stretchMode: "elastic" | "precise";
  transientsMode: "crisp" | "mixed" | "smooth";
  detectorMode: "compound" | "percussive" | "soft";
  phaseMode: "laminar" | "independent";
  threadingMode: "auto" | "never" | "always";
  windowMode: "standard" | "short" | "long";
  smoothing: boolean;
  formantMode: "shifted" | "preserved";
  pitchMode: "highspeed" | "highquality" | "highconsistency";
  channelMode: "apart" | "together";
  engineMode: "faster" | "finer";
};

// eslint-disable-next-line max-statements
const optionsToBitmask = ({ options }: { options: Partial<TRubberbandOptions> }): number => {
  let bitmask = 0;

  const addIf = ({ condition, value }: { condition: boolean; value: number }) => {
    if (condition) {
      bitmask |= value;
    }
  };

  addIf({ condition: options.processMode === "realtime", value: OptionProcessRealTime });
  addIf({ condition: options.processMode === "offline", value: OptionProcessOffline });
  addIf({ condition: options.stretchMode === "elastic", value: OptionStretchElastic });
  addIf({ condition: options.stretchMode === "precise", value: OptionStretchPrecise });
  addIf({ condition: options.transientsMode === "mixed", value: OptionTransientsMixed });
  addIf({ condition: options.transientsMode === "crisp", value: OptionTransientsCrisp });
  addIf({ condition: options.transientsMode === "smooth", value: OptionTransientsSmooth });
  addIf({ condition: options.detectorMode === "compound", value: OptionDetectorCompound });
  addIf({ condition: options.detectorMode === "percussive", value: OptionDetectorPercussive });
  addIf({ condition: options.detectorMode === "soft", value: OptionDetectorSoft });
  addIf({ condition: options.phaseMode === "laminar", value: OptionPhaseLaminar });
  addIf({ condition: options.phaseMode === "independent", value: OptionPhaseIndependent });
  addIf({ condition: options.threadingMode === "auto", value: OptionThreadingAuto });
  addIf({ condition: options.threadingMode === "never", value: OptionThreadingNever });
  addIf({ condition: options.threadingMode === "always", value: OptionThreadingAlways });
  addIf({ condition: options.windowMode === "standard", value: OptionWindowStandard });
  addIf({ condition: options.windowMode === "short", value: OptionWindowShort });
  addIf({ condition: options.windowMode === "long", value: OptionWindowLong });
  addIf({ condition: options.smoothing === false, value: OptionSmoothingOff });
  addIf({ condition: options.smoothing === true, value: OptionSmoothingOn });
  addIf({ condition: options.formantMode === "preserved", value: OptionFormantPreserved });
  addIf({ condition: options.formantMode === "shifted", value: OptionFormantShifted });
  addIf({ condition: options.pitchMode === "highspeed", value: OptionPitchHighSpeed });
  addIf({ condition: options.pitchMode === "highquality", value: OptionPitchHighQuality });
  addIf({ condition: options.pitchMode === "highconsistency", value: OptionPitchHighConsistency });
  addIf({ condition: options.channelMode === "apart", value: OptionChannelsApart });
  addIf({ condition: options.channelMode === "together", value: OptionChannelsTogether });
  addIf({ condition: options.engineMode === "faster", value: OptionEngineFaster });
  addIf({ condition: options.engineMode === "finer", value: OptionEngineFiner });

  return bitmask;
};

export {
  optionsToBitmask
};

export type {
  TRubberbandOptions
};
