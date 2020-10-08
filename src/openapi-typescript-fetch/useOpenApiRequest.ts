import React from "react";
import {
  OpenApiCompleteRequestState,
  OpenApiNetworkErrorRequestState,
  OpenApiRequestState,
  OpenApiServerErrorRequestState,
} from "./openApiRequestState";
import { OpenApiRequestStatus } from "./openApiRequestStatus";
import { useOpenApiRequestState } from "./useOpenApiRequestState";

// Returns the type of promise payload
type Unwrap<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Returns a request state and a callback to trigger the request
 * @param func API method call to call when request has been triggered
 */
export function useOpenApiRequest<
  TApiMethod extends (...args: any) => any,
  TParameters extends Parameters<TApiMethod>,
  TResponse extends Unwrap<ReturnType<TApiMethod>>
>(
  func: TApiMethod
): [
  OpenApiRequestState<TResponse, TParameters>,
  (
    ...parameters: TParameters
  ) => Promise<OpenApiRequestState<TResponse, TParameters>>
] {
  const [state, setState] = useOpenApiRequestState<TResponse, TParameters[0]>();

  const request = React.useCallback(
    async (...parameters: TParameters) => {
      const startTime = new Date().toISOString();
      try {
        setState({
          type: OpenApiRequestStatus.Pending,
          startTime: startTime,
          requestPayload: parameters,
        });

        const response = await func(...parameters);

        const state: OpenApiCompleteRequestState<TResponse, TParameters> = {
          type: OpenApiRequestStatus.Complete,
          startTime: startTime,
          endTime: new Date().toISOString(),
          requestPayload: parameters ? parameters[0] : undefined,
          responsePayload: response,
        };

        setState(state);
        return state;
      } catch (err) {
        // status only exists in the response if we successfully
        // connected to the endpoint
        if (typeof err.status === "number") {
          const state: OpenApiServerErrorRequestState<TParameters> = {
            type: OpenApiRequestStatus.ServerError,
            startTime: startTime,
            endTime: new Date().toISOString(),
            requestPayload: parameters,
            error: err,
          };
          setState(state);
          return state;
        } else {
          const state: OpenApiNetworkErrorRequestState<TParameters> = {
            type: OpenApiRequestStatus.NetworkError,
            startTime: startTime,
            endTime: new Date().toISOString(),
            requestPayload: parameters,
            error: err,
          };
          setState(state);
          return state;
        }
      }
    },
    [func]
  );

  return [state, request];
}
