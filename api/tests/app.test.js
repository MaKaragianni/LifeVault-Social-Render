const request = require("supertest");
const app = require("../app");

describe("Global Application Error and 404 Routers", () => {
  test("returns 404 JSON for unknown or undefined application paths", async () => {
    const response = await request(app).get("/this-route-does-not-exist");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ err: "Error 404: Not Found" });
  });
});