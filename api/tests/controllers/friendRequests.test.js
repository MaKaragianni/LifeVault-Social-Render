const request = require("supertest");
const app = require("../../app");

describe("Friend Requests API", () => {
  test("GET /friendRequests/requests requires auth", async () => {
    const res = await request(app).get(
      "/friendRequests/requests"
    );

    expect([401, 403]).toContain(res.statusCode);
  });

  test("POST friend request route exists", async () => {
    const res = await request(app)
      .post("/friendRequests/request/123");

    expect([401, 403]).toContain(res.statusCode);
  });
});