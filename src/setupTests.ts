import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { localStorageMock } from "./__mocks__/localStorageMock";

// Move the reload function
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: jest.fn() },
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window, "localStorage", { value: localStorageMock() });

  let counter = 1000;
  Object.defineProperty(window, "crypto", {
    writable: true,
    value: {
      randomUUID: () => {
        counter++;
        return `${counter}`;
      },
    },
  });

  document.documentElement.scrollTo = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  process.env.REACT_APP_API_URL = "/";
});

beforeEach(() => {});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  cleanup();
  jest.restoreAllMocks();
});
