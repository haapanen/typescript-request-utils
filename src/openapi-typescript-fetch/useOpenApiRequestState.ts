import React from "react";
import { OpenApiRequestState } from "./openApiRequestState";
import { OpenApiRequestStatus } from "./openApiRequestStatus";

/**
 * Returns a request state and a function to update it
 */
export function useOpenApiRequestState<TResponsePayload, TRequestPayload>(): [
  OpenApiRequestState<TResponsePayload, TRequestPayload>,
  React.Dispatch<
    React.SetStateAction<OpenApiRequestState<TResponsePayload, TRequestPayload>>
  >
] {
  const [state, setState] = React.useState<
    OpenApiRequestState<TResponsePayload, TRequestPayload>
  >({
    type: OpenApiRequestStatus.Initial,
  });

  return [state, setState];
}
