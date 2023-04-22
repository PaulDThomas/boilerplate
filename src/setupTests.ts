// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env.REACT_APP_API_URL = '/';
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
