import { RequestStatus } from "./requestStatus";

/**
 * Request has not yet started
 */
export interface InitialRequestState {
  readonly type: RequestStatus.Initial;
}

/**
 * Request has started with requestPayload at startTime
 */
export interface PendingRequestState<TRequestPayload> {
  readonly type: RequestStatus.Pending;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
}

/**
 * Request has completed with responsePayload at endTime
 */
export interface CompleteRequestState<TResponsePayload, TRequestPayload> {
  readonly type: RequestStatus.Complete;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
  readonly endTime: string;
  readonly responsePayload: TResponsePayload;
}

/**
 * Request has failed with error at endTime
 */
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
