import { act, renderHook } from "@testing-library/react-hooks";
import { RequestStatus } from "./src/requestStatus";
import { useRequest } from "./src/useRequest";

interface Point {
  x: number;
  y: number;
}

class ExampleApi {
  parameterlessMethod = () => {
    return Promise.resolve({
      type: "parameterlessMethod",
    });
  };

  oneParameterMethod = (point: Point) => {
    return Promise.resolve(point);
  };

  multipleParametersMethod = (pointA: any, pointB: any, pointC: any) => {
    return Promise.resolve({
      pointA,
      pointB,
      pointC,
    });
  };

  failingMethod = () => {
    return Promise.reject("no reason");
  };
}

test("useRequest returns initial state correctly", () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  expect(result.current[0].type).toBe(RequestStatus.Initial);
});

test("useRequest returns pending state after operation has been requested", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  act(() => {
    result.current[1]({
      x: 1,
      y: 2,
    });
  });

  expect(result.current[0].type).toBe(RequestStatus.Pending);
});

test("useRequest returns pending state after operation has completed", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  await act(async () => {
    await result.current[1]({
      x: 1,
      y: 2,
    });
  });

  expect(result.current[0].type).toBe(RequestStatus.Complete);
});

test("useRequest sets requestPayload", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === RequestStatus.Complete) {
    expect(result.current[0].requestPayload[0]).toBe(requestPayload);
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useRequest sets responsePayload", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === RequestStatus.Complete) {
    expect(result.current[0].responsePayload).toMatchObject(requestPayload);
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useRequest sets the startTime", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === RequestStatus.Complete) {
    expect(result.current[0].startTime).not.toBeFalsy();
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useRequest sets the endTime", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().oneParameterMethod)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload);
  });

  if (result.current[0].type === RequestStatus.Complete) {
    expect(result.current[0].startTime).not.toBeFalsy();
  } else {
    fail(`${result.current[0].type} should be Complete`);
  }
});

test("useRequest supports APIs without parameters", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().parameterlessMethod)
  );

  await act(async () => {
    await result.current[1]();
  });

  expect(result.current[0].type).toBe(RequestStatus.Complete);
});

test("useRequest supports APIs with multiple parameters", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().multipleParametersMethod)
  );

  const requestPayload = {
    x: 1,
    y: 2,
  };
  await act(async () => {
    await result.current[1](requestPayload, requestPayload, requestPayload);
  });

  expect(result.current[0].type).toBe(RequestStatus.Complete);
});

test("useRequest returns error state if operation fails", async () => {
  const { result } = renderHook(() =>
    useRequest(new ExampleApi().failingMethod)
  );

  await act(async () => {
    await result.current[1]();
  });

  expect(result.current[0].type).toBe(RequestStatus.Error);
});
