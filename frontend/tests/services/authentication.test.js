import createFetchMock from "vitest-fetch-mock";
import { describe, vi } from "vitest";

import { login, signup } from "../../src/services/authentication";

const BACKEND_URL = "http://localhost:3000";

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("authentication service", () => {
  describe("login", () => {
    test("calls the backend url for a token", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      await login(testEmail, testPassword);

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/tokens`);
      expect(options.method).toEqual("POST");
      expect(options.body).toEqual(
        JSON.stringify({ email: testEmail, password: testPassword })
      );
      expect(options.headers["Content-Type"]).toEqual("application/json");
    });

    test("returns the token if the request was a success", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      const result = await login(testEmail, testPassword);
      
      expect(result).toEqual({ token: "testToken" });
    });

    test("throws an error if the request failed", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ message: "Wrong Password" }), {
        status: 403,
      });

      try {
        await login(testEmail, testPassword);
      } catch (err) {
        expect(err.message).toEqual(
          "Received status 403 when logging in. Expected 201"
        );
      }
    });
  });

  describe("signup", () => {
    test("calls the backend url for a token", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce("", {
        status: 201,
      });

      // Pass matching parameters to the service call
      await signup(testEmail, testPassword, testPassword, "testuser", null, "my bio", "2000-01-01");

      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/users`);
      expect(options.method).toEqual("POST");
      
      // Since body is FormData, inspect its contents using .get()
      expect(options.body.get("email")).toEqual(testEmail);
      expect(options.body.get("password")).toEqual(testPassword);
      expect(options.body.get("dateOfBirth")).toEqual("2000-01-01");
      
      // Notice: We don't check Content-Type headers here because the browser evaluates FormData boundaries dynamically!
    });

    test("returns nothing if the signup request was a success", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify(""), {
        status: 201,
      });

      const token = await signup(testEmail, testPassword);
      expect(token).toEqual(undefined);
    });

    test("throws an error if the request failed", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(
        JSON.stringify({ message: "User already exists" }),
        {
          status: 400,
        }
      );

      try {
        await signup(testEmail, testPassword);
      } catch (err) {
        expect(err.message).toEqual(
          "User already exists"
        );
      }
    });
  });
});