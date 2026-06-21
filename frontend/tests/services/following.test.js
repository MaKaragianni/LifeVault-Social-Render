import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi, test, rejects } from "vitest";
import {
  getAllFriends,
  searchUsers,
  handleFollow,
} from "../../src/services/following";

const BACKEND_URL = "http://localhost:3000";

createFetchMock(vi).enableMocks();

describe("Following Frontend API Service Layer", () => {
  describe("getAllFriends()", () => {
    test("submits a GET request to retrieve user friends data", async () => {
      const stubfriendData = {
        user: {
          _id: "60c72b2f9b1d8b2bad6e1a2c",
          email: "doe@example.com",
          username: "john_doe",
          bio: "Software developer from London",
          profilePic: "http://localhost:3000/uploads/avatar.png",
          friends: [],
        },
      };

      const stubfriendData2 = {
        user: {
          _id: "60c72b2f9b1d8b2bad6e1a3b",
          email: "ann@example.com",
          username: "ann_doe",
          bio: "Software developer from Worcester",
          profilePic: "http://localhost:3000/uploads/icon.png",
          friends: [],
        },
      };

      const stubPayload = {
        friends: [{ stubfriendData }, { stubfriendData2 }],
        token: "testToken123",
      };
      fetch.mockResponseOnce(JSON.stringify(stubPayload), { status: 200 });

      const parsedResult = await getAllFriends("testToken123");

      const lastFetchCall = fetch.mock.lastCall;
      const url = lastFetchCall[0];

      expect(url).toEqual(`${BACKEND_URL}/friends`, "testToken123");
      expect(parsedResult).toEqual(stubPayload);
    });

    test("does not resolve with parsed data when backend returns an error payload", async () => {
      await expect(getAllFriends("Invalid_id")).rejects.toThrow(
        "Unable to fetch following data",
      );
    });

    describe("searchUsers()", () => {
      test("submits a GET request to retrieve matching user data to the query", async () => {
        const stubPayload = {
          user: {
            _id: "60c72b2f9b1d8b2bad6e1a2c",
            email: "doe@example.com",
            username: "John",
            bio: "Software developer from London",
            profilePic: "http://localhost:3000/uploads/avatar.png",
            friends: [],
          },
        };
        fetch.mockResponseOnce(JSON.stringify(stubPayload), { status: 200 });

        const parsedResult = await searchUsers("1234", "John");

        const lastFetchCall = fetch.mock.lastCall;
        const url = lastFetchCall[0];

        expect(url).toEqual(`${BACKEND_URL}/users/search?username=John`);
        expect(parsedResult).toEqual(stubPayload);
      });
      test("throws error when backend returns an error payload", async () => {
        await expect(
          searchUsers("Invalid_token", "invalid_query"),
        ).rejects.toThrow("Unable to fetch user");
      });
    });
    describe("handleFollow()", () => {
      test("submits a POST request to follow or unfollow a user", async () => {
        const stubPayload = { message: "followed" };
        fetch.mockResponseOnce(JSON.stringify(stubPayload), { status: 200 });

        const parsedResult = await handleFollow(
          "token",
          "60c72b2f9b1d8b2bad6e1a3b",
        );

        const lastFetchCall = fetch.mock.lastCall;
        const url = lastFetchCall[0];

        expect(url).toEqual(
          `${BACKEND_URL}/users/60c72b2f9b1d8b2bad6e1a3b/handlefollow`,
        );
        expect(parsedResult).toEqual(stubPayload);
      });
      test("throws error when backend returns an error payload", async () => {
        await expect(
          handleFollow("Invalid_token", "Invalid_id"),
        ).rejects.toThrow("Something went wrong");
      });
    });
  });
});
