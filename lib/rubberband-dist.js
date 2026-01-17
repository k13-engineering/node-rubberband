/* c8 ignore start */
import { loadAsBlob } from "esm-resource";

const loadRubberbandWasm = async () => {
  const rubberbandBlob = await loadAsBlob({ importMeta: import.meta, filepath: "../../node_modules/rubberband-wasm/dist/rubberband.wasm" });
  const rubberbandWasmArrayBuffer = await rubberbandBlob.arrayBuffer();
  const rubberbandWasm = new Uint8Array(rubberbandWasmArrayBuffer);
  return rubberbandWasm;
};

export {
  loadRubberbandWasm
};
/* c8 ignore end */
