import { OpenApiRequestStatus } from "./openApiRequestStatus";

/**
 * Request has not yet started
 */
export interface OpenApiInitialRequestState {
  readonly type: OpenApiRequestStatus.Initial;
}

/**
 * Request has started with requestPayload at startTime
 */
export interface OpenApiPendingRequestState<TRequestPayload> {
  readonly type: OpenApiRequestStatus.Pending;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
}

/**
 * Request has completed with responsePayload at endTime
 */
export interface OpenApiCompleteRequestState<
  TResponsePayload,
  TRequestPayload
> {
  readonly type: OpenApiRequestStatus.Complete;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
  readonly endTime: string;
  readonly responsePayload: TResponsePayload;
}

/**
 * Request has failed due to a network error at endTime
 */
export interface OpenApiNetworkErrorRequestState<TRequestPayload> {
  readonly type: OpenApiRequestStatus.NetworkError;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
  readonly endTime: string;
  readonly error: {
    readonly message: string;
    readonly stack: string;
  };
}

/**
 * Request has failed due to a server error at endTime
 */
export interface OpenApiServerErrorRequestState<TRequestPayload> {
  readonly type: OpenApiRequestStatus.ServerError;
  readonly startTime: string;
  readonly requestPayload: TRequestPayload;
  readonly endTime: string;
  readonly error: Response;
}

export type OpenApiRequestState<TResponsePayload, TRequestPayload> =
  | OpenApiInitialRequestState
  | OpenApiPendingRequestState<TRequestPayload>
  | OpenApiCompleteRequestState<TResponsePayload, TRequestPayload>
  | OpenApiNetworkErrorRequestState<TRequestPayload>
  | OpenApiServerErrorRequestState<TRequestPayload>;
