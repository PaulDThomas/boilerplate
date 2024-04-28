import { loadWrapper } from "./loadWrapper";
import { mockLoadFn } from "./__mocks__/mockLoadFn";

describe("Load wrapper tests", () => {
  test("Initial request", async () => {
    const mockSetStatus = jest.fn();
    const abortFn = jest.fn();
    const abortController = jest.spyOn(global, "AbortController").mockImplementation(() => {
      return {
        abort: abortFn,
        signal: {
          aborted: false,
          onabort: jest.fn(),
          reason: "",
          throwIfAborted: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        },
      };
    });
    expect(
      await loadWrapper(
        mockLoadFn,
        "1",
        { requesting: false, error: false },
        mockSetStatus,
        "backEndUrl",
      ),
    ).toEqual({ success: true });
    expect(abortController).toHaveBeenCalledTimes(1);
    expect(mockSetStatus).toHaveBeenCalledTimes(2);
    const calledParams = mockSetStatus.mock.calls;
    expect(calledParams[0][0].requesting).toEqual(true);
    expect(calledParams[0][0].requestingId).toEqual("1");
    expect(typeof calledParams[0][0].cancel).toEqual("function");
    expect(calledParams[0][0].error).toEqual(false);
    expect(mockSetStatus).toHaveBeenCalledWith({
      requesting: false,
      requestedId: "1",
      error: false,
    });
  });

  test("Skip request", async () => {
    const mockSetStatus = jest.fn();
    const abortFn = jest.fn();
    const abortController = jest.spyOn(global, "AbortController").mockImplementation(() => {
      return {
        abort: abortFn,
        signal: {
          aborted: false,
          onabort: jest.fn(),
          reason: "",
          throwIfAborted: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        },
      };
    });
    expect(
      await loadWrapper(
        mockLoadFn,
        "1",
        { requesting: true, requestingId: "1", error: false },
        mockSetStatus,
        "backEndUrl",
      ),
    ).toEqual(null);
    expect(abortController).not.toHaveBeenCalled();
    expect(mockSetStatus).not.toHaveBeenCalled();
  });

  test("Cancelling request", async () => {
    const mockSetLS = jest.fn();
    const abortFn = jest.fn();
    const abortController = jest.spyOn(global, "AbortController").mockImplementation(() => {
      return {
        abort: abortFn,
        signal: {
          aborted: false,
          onabort: jest.fn(),
          reason: "",
          throwIfAborted: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        },
      };
    });
    expect(
      await loadWrapper(
        mockLoadFn,
        "10",
        { requesting: true, error: false, requestingId: "1", cancel: abortFn },
        mockSetLS,
        "backEndUrl",
      ),
    ).toEqual({ success: true });
    expect(abortController).toHaveBeenCalledTimes(1);
    expect(abortFn).toHaveBeenCalledTimes(1);
    expect(mockSetLS).toHaveBeenCalledTimes(2);
    const calledParams = mockSetLS.mock.calls;
    expect(calledParams[0][0].requesting).toEqual(true);
    expect(calledParams[0][0].requestingId).toEqual("10");
    expect(typeof calledParams[0][0].cancel).toEqual("function");
    expect(calledParams[0][0].error).toEqual(false);
    expect(mockSetLS).toHaveBeenCalledWith({
      requesting: false,
      requestedId: "10",
      error: false,
    });
  });

  test("Failed request", async () => {
    const mockSetLS = jest.fn();
    const abortFn = jest.fn();
    const abortController = jest.spyOn(global, "AbortController").mockImplementation(() => {
      return {
        abort: abortFn,
        signal: {
          aborted: false,
          onabort: jest.fn(),
          reason: "",
          throwIfAborted: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        },
      };
    });
    expect(
      await loadWrapper(
        mockLoadFn,
        "10",
        { requesting: true, error: false, requestingId: "1", cancel: abortFn },
        mockSetLS,
        "backEndUrl/fail",
      ),
    ).toEqual({ success: false, ErrorText: "Mock load failure" });
    expect(abortController).toHaveBeenCalledTimes(1);
    expect(abortFn).toHaveBeenCalledTimes(1);
    expect(mockSetLS).toHaveBeenCalledTimes(2);
    const calledParams = mockSetLS.mock.calls;
    expect(calledParams[0][0].requesting).toEqual(true);
    expect(calledParams[0][0].requestingId).toEqual("10");
    expect(typeof calledParams[0][0].cancel).toEqual("function");
    expect(calledParams[0][0].error).toEqual(false);
    expect(mockSetLS).toHaveBeenCalledWith({
      requesting: false,
      requestedId: "10",
      error: true,
      errorText: "Mock load failure",
    });
    // Call cancellation function
    calledParams[0][0].cancel();
  });
});
