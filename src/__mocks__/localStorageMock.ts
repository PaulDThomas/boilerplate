export const localStorageMock = jest.fn(() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => {
      return store[key];
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
});
