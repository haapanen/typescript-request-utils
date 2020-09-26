import { act, renderHook } from "@testing-library/react-hooks";
import { OpenApiRequestStatus } from "./openApiRequestStatus";
import { useOpenApiRequest } from "./useOpenApiRequest";

interface Point {
  x: number;
  y: number;
}

class OpenApiMock {
  getPoint(point: Point): Promise<Point> {
    return Promise.resolve({
      x: point.x,
      y: point.y,
    });
  }

  getPointWithoutParameters(): Promise<Point> {
    return Promise.resolve({
      x: 0,
      y: 0,
    });
  }

  getNetworkError(_point: Point): Promise<Point> {
    return Promise.reject({
      message: "network error",
      stack: "...",
    });
  }

  getServerError(_point: Point): Promise<Point> {
    const response: Partial<Response> = {
      status: 500,
    };
    return Promise.reject(response);
  }
}

const point: Point = {
  x: 0,
  y: 0,
};

test("useOpenApiRequest returns initial state correctly", () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPoint)
  );

  expect(result.current[0].type).toBe(OpenApiRequestStatus.Initial);
});

test("useOpenApiRequest returns pending state after operation has been requested", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPoint)
  );

  act(() => {
    result.current[1](point);
  });

  expect(result.current[0].type).toBe(OpenApiRequestStatus.Pending);
});

test("useOpenApiRequest sets requestPayload", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPoint)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === OpenApiRequestStatus.Complete) {
    expect(result.current[0].requestPayload).toBe(requestPayload);
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useOpenApiRequest sets responsePayload", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPoint)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === OpenApiRequestStatus.Complete) {
    expect(result.current[0].responsePayload).toMatchObject(requestPayload);
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useOpenApiRequest sets the startTime", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPoint)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === OpenApiRequestStatus.Complete) {
    expect(result.current[0].startTime).not.toBeFalsy();
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useOpenApiRequest sets the endTime", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPoint)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === OpenApiRequestStatus.Complete) {
    expect(result.current[0].startTime).not.toBeFalsy();
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useOpenApiRequest does not require undefined parameter on parameterless api calls", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getPointWithoutParameters)
  );
  await act(async () => {
    await result.current[1]();
  });

  expect(result.current[0].type).toBe(OpenApiRequestStatus.Complete);
});

test("useOpenApiRequest returns a network error if no status code was specified in error response", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getNetworkError)
  );

  await act(async () => {
    await result.current[1](point);
  });

  expect(result.current[0].type).toBe(OpenApiRequestStatus.NetworkError);
});

test("useOpenApiRequest returns a server error if status code was specified in error response", async () => {
  const { result } = renderHook(() =>
    useOpenApiRequest(new OpenApiMock().getServerError)
  );

  await act(async () => {
    await result.current[1](point);
  });

  expect(result.current[0].type).toBe(OpenApiRequestStatus.ServerError);
});
