import _ from "lodash";
import { IRequestStatus } from "./interface";
import { NextResponse } from "next/server";

export const loadWrapper = async <T extends string | number | object | undefined, R>(
  asyncFn: (target: T, controller: AbortController) => Promise<R>,
  fnTarget: T,
  requestStatus: IRequestStatus<T>,
  setRequestStatus: (arg: IRequestStatus<T>) => void,
  haltOnError = false,
): Promise<R | null> => {
  // Assume nothing is happening
  const doLoad =
    !(haltOnError && requestStatus.error) &&
    ((requestStatus.requesting && !_.isEqual(requestStatus.requestingId, fnTarget)) ||
      (!requestStatus.requesting &&
        (!_.isEqual(requestStatus.requestedId, fnTarget) || requestStatus.error)));
  // Check there is a need to request
  if (doLoad && requestStatus.cancel) {
    requestStatus.cancel();
  }

  // Stop if hierarchy is less than zero or already requesting, or already errored
  if (doLoad) {
    const controller = new AbortController();
    setRequestStatus({
      requesting: true,
      requestingId: fnTarget,
      cancel: () => controller.abort(),
      error: false,
    });
    const response: R = await asyncFn(fnTarget, controller);
    setRequestStatus({
      requesting: false,
      requestedId: fnTarget,
      error: (response as NextResponse | undefined)?.ok === false,
    });
    return response;
  }
  return null;
};
