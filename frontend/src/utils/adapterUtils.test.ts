import { mediationRequests } from "../testUtils";
import {
  axiosGetResponseMediationRequests,
  resetAxiosMocks,
} from "../__mocks__/axiosMock";
import { keysToCamel, keysToSnake } from "./adapterUtils";

beforeEach(() => {
  resetAxiosMocks();
});

it("transforms snake case keys to camel case keys", () => {
  const result = keysToCamel(axiosGetResponseMediationRequests.data);
  expect(result).toEqual(mediationRequests);
});

it("transforms camel case keys to snake case keys", () => {
  const result = keysToSnake(mediationRequests);
  expect(result).toEqual(axiosGetResponseMediationRequests.data);
});
