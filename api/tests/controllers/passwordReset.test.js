const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const PasswordResetToken = require("../../models/PasswordResetToken");

require("../mongodb_helper");

describe("Password Reset API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await PasswordResetToken.deleteMany({});
  });

  test("POST /passwordReset/request works", async () => {
    const res = await request(app)
      .post("/passwordReset/request")
      .send({ email: "test@test.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test("POST /passwordReset/reset requires token validation", async () => {
    const res = await request(app)
      .post("/passwordReset/reset")
      .send({
        token: "invalid",
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
  });
});