import { mediationRequests } from "../testUtils";
import { mediationRequestsResponse } from "../__mocks__/axiosMock";
import { keysToCamel, keysToSnake } from "./adapterUtils";

it("transforms snake case keys to camel case keys", () => {
  const result = keysToCamel(mediationRequestsResponse);
  expect(result).toEqual(mediationRequests);
});

it("transforms camel case keys to snake case keys", () => {
  const result = keysToSnake(mediationRequests);
  expect(result).toEqual(mediationRequestsResponse);
});
