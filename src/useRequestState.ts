import React from "react";
import { RequestState } from "./requestState";
import { RequestStatus } from "./requestStatus";

export function useRequestState<
  TResponsePayload,
  TRequestPayload,
  TError = unknown
>(): [
  RequestState<TResponsePayload, TRequestPayload, TError>,
  React.Dispatch<
    React.SetStateAction<
      RequestState<TResponsePayload, TRequestPayload, TError>
    >
  >
] {
  const [state, setState] = React.useState<
    RequestState<TResponsePayload, TRequestPayload, TError>
  >({
    type: RequestStatus.Initial,
  });

  return [state, setState];
}
