import { RequestStatus } from "./requestStatus";

export interface InitialRequestState {
  readonly type: RequestStatus.Initial;
}

export interface PendingRequestState<TRequestPayload> {
  readonly type: RequestStatus.Pending;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
}

export interface CompleteRequestState<TResponsePayload, TRequestPayload> {
  readonly type: RequestStatus.Complete;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
  readonly endTime: string;
  readonly responsePayload: TResponsePayload;
}

export interface ErrorRequestState<TRequestPayload, TError> {
  readonly type: RequestStatus.Error;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
  readonly endTime: string;
  readonly error: TError;
}

export type RequestState<TResponsePayload, TRequestPayload, TError = unknown> =
  | InitialRequestState
  | PendingRequestState<TRequestPayload>
  | CompleteRequestState<TResponsePayload, TRequestPayload>
  | ErrorRequestState<TRequestPayload, TError>;
