# typescript-request-utils

Some utilities to simplify request handling on TypeScript

# Installation

npm install --save typescript-request-utils

# Usage

## OpenAPI typescript-fetch

Example usage:

```tsx
function Component(props: {}) {
  // You must use useMemo or initialize the API elsewhere
  // if api is called in a useEffect. If not, a new API
  // will be initialized whenever React renders the view
  // causing an infinite loop
  const api = React.useMemo(new ItemApi(), []);
  api.getItems.bind(api);
  const [itemsRequest, loadItems] = useOpenApiRequest(api.getItems);

  if (itemsRequest.type === OpenApiRequestStatus.Pending) {
    // itemsRequest has the following fields:
    // startTime
    // requestPayload
    return <div>{itemsRequst.startTime}</div>;
  } else if (itemsRequest.type === OpenApiRequestStatus.Complete) {
    // itemsRequest has the following fields:
    // startTime
    // requestPayload
    // endTime
    // responsePayload
    return <div>{itemsRequest.responsePayload[0].itemName}</div>;
  } else if (itemsRequest.type === OpenApiRequestStatus.NetworkError) {
    // itemsRequest has the following fields:
    // startTime
    // requestPayload
    // endTime
    // error: {
    //     readonly message: string;
    //     readonly stack: string;
    // }
    return <div>{itemsRequest.error.message}</div>;
  } else if (itemsRequest.type === OpenApiRequestStatus.ServerError) {
    // itemsRequest has the following fields:
    // startTime
    // requestPayload
    // endTime
    // error: Response (fetch response)
    return <div>{itemsRequest.error.status}</div>;
  }

  return <button onClick={loadItems}>Load items</button>;
}
```
