// stores.ts reads localStorage when it is first imported. Plain Node has none,
// so provide a minimal in-memory stand-in (jsdom tests already have one).
if (typeof globalThis.localStorage?.getItem !== "function") {
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
}
