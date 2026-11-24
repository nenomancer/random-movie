// stores.ts reads localStorage when it is first imported, and tests run in
// plain Node (no DOM), so provide a minimal in-memory stand-in.
const data = new Map<string, string>();

globalThis.localStorage = {
  getItem: (key: string) => data.get(key) ?? null,
  setItem: (key: string, value: string) => void data.set(key, String(value)),
  removeItem: (key: string) => void data.delete(key),
  clear: () => data.clear(),
  key: (index: number) => [...data.keys()][index] ?? null,
  get length() {
    return data.size;
  },
} as Storage;
