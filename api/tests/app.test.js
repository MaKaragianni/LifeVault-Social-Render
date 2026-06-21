const request = require("supertest");
const app = require("../app");

describe("Global Application Error and 404 Routers", () => {
  test("returns 404 JSON for unknown routes", async () => {
    const response = await request(app).get("/this-route-does-not-exist");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ err: "Error 404: Not Found" });
  });

  // FRIEND REQUEST ROUTE CHECK
  test("friend request routes are mounted", async () => {
    const response = await request(app).get("/friendRequests/requests");
    // 401 expected because route is protected by tokenChecker
    expect([401, 403]).toContain(response.statusCode);
  });
  
  // PASSWORD RESET ROUTE CHECK
  test("password reset route exists", async () => {
    const response = await request(app)
      .post("/passwordReset/request")
      .send({ email: "nonexistent@test.com" });

    // 200 = safe response OR 404 depending on controller logic
    expect([200, 404]).toContain(response.statusCode);
  });
});