export function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return function() {
    state = (state * 0x5DEECE66D + 0xB) & 0xFFFFFFFF;
    return (state >>> 0) / 0xFFFFFFFF;
  };
}
