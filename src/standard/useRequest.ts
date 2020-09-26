import {
  RequestState,
  CompleteRequestState,
  ErrorRequestState,
} from "./requestState";
import { RequestStatus } from "./requestStatus";
import { useRequestState } from "./useRequestState";

// Returns the type of promise payload
type Unwrap<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Returns a request state and a callback to trigger the request
 * @param func API method call to call when request has been triggered
 */
export function useRequest<
  TApiMethod extends (...args: any) => any,
  TParameters extends Parameters<TApiMethod>,
  TResponse extends Unwrap<ReturnType<TApiMethod>>,
  TError = unknown
>(
  func: TApiMethod
): [
  RequestState<TResponse, TParameters>,
  (
    ...parameters: TParameters
  ) => Promise<RequestState<TResponse, TParameters, TError>>
] {
  const [state, setState] = useRequestState<TResponse, TParameters, TError>();

  const request = async (...parameters: TParameters) => {
    const startTime = new Date().toISOString();
    try {
      setState({
        type: RequestStatus.Pending,
        startTime: startTime,
        requestPayload: parameters,
      });

      // FIXME: figure out a way to handle the typing without as any
      const response = await func(...(parameters as any));

      const state: CompleteRequestState<TResponse, TParameters> = {
        type: RequestStatus.Complete,
        startTime: startTime,
        endTime: new Date().toISOString(),
        requestPayload: parameters,
        responsePayload: response,
      };

      setState(state);
      return state;
    } catch (err) {
      const state: ErrorRequestState<TParameters, TError> = {
        type: RequestStatus.Error,
        startTime: startTime,
        endTime: new Date().toISOString(),
        requestPayload: parameters,
        error: err,
      };

      setState(state);
      return state;
    }
  };

  return [state, request];
}
