import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi, test } from "vitest";
import { getUser } from "../../src/services/users";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("Users Frontend API Service Layer", () => {
  describe("getUser()", () => {
    test("submits a GET request to retrieve user profile data", async () => {
      const stubPayload = { user: { username: "john_doe" }, posts: [] };
      fetch.mockResponseOnce(JSON.stringify(stubPayload), { status: 200 });

      // Calling function using only the single parameter it currently accepts
      const parsedResult = await getUser("12345");

      const lastFetchCall = fetch.mock.lastCall;
      const url = lastFetchCall[0];

      // Matching the actual behavior of service function
      expect(url).toEqual(`${BACKEND_URL}/users/12345`);
      expect(parsedResult).toEqual(stubPayload);
    });

    test("resolves with parsed data even when backend returns an error payload", async () => {
      const errorPayload = { message: "Something went wrong" };
      fetch.mockResponseOnce(JSON.stringify(errorPayload), { status: 400 });

      // Since the source code does not throw errors on bad statuses, 
      // we assert that it resolves safely with the error message object.
      const parsedResult = await getUser("invalid_id");
      expect(parsedResult).toEqual(errorPayload);
    });
  });
});