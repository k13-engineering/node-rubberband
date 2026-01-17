const isNode = typeof globalThis.process !== "undefined" &&
  globalThis.process.versions !== null &&
  globalThis.process.versions.node !== null;

const loadRubberbandWasmNodeJs = async () => {
  const nodeFs = await import("fs");
  const nodeUrl = await import("url");
  const rubberbandWasmUrl = import.meta.resolve("rubberband-wasm/dist/rubberband.wasm");
  const rubberbandWasmPath = nodeUrl.fileURLToPath(rubberbandWasmUrl);
  const rubberbandWasm = await nodeFs.promises.readFile(rubberbandWasmPath);
  return new Uint8Array(rubberbandWasm);
};

const loadRubberbandWasm = async () => {

  if (isNode) {
    return await loadRubberbandWasmNodeJs();
  }

  throw Error("browser environment not implemented yet");
};

export {
  loadRubberbandWasm
};
