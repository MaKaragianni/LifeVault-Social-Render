import { describe, test, expect, vi, beforeEach } from "vitest";
import { getFriends, searchUsers } from "../../src/services/friends";

global.fetch = vi.fn();

describe("Friends Service", () => {
  const mockToken = "fake-jwt-token";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFriends", () => {
    test("fetches and returns friends successfully on status 200", async () => {
      const mockFriendsData = [{ _id: "1", username: "Alice" }];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFriendsData,
      });

      const result = await getFriends(mockToken);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/friends"),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );
      expect(result).toEqual(mockFriendsData);
    });

    test("throws an error if the response is not ok", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getFriends(mockToken)).rejects.toThrow("Unable to load friends");
    });
  });

  describe("searchUsers", () => {
    test("fetches and returns matching users successfully on status 200", async () => {
      const mockSearchResults = [{ _id: "2", username: "Bob" }];
      const query = "Bob";

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResults,
      });

      const result = await searchUsers(mockToken, query);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/users/search?q=${query}`),
        expect.objectContaining({
          method: "GET",
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );
      expect(result).toEqual(mockSearchResults);
    });

    test("throws an error if search response fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(searchUsers(mockToken, "invalid")).rejects.toThrow("Unable to search users");
    });
  });
});