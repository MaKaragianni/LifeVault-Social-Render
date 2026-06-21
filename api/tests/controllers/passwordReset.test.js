const request = require("supertest");

const app = require("../../app");

require("../mongodb_helper");

const User = require("../../models/user");
const PasswordResetToken =
  require("../../models/PasswordResetToken");

describe("Password Reset", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await PasswordResetToken.deleteMany({});

    await User.create({
      email: "reset@test.com",
      password: "12345678",
      username: "resetuser",
      dateOfBirth: new Date("1990-01-01"),
    });
  });

  test("creates reset token", async () => {
    const response = await request(app)
      .post("/passwordReset/request")
      .send({
        email: "reset@test.com",
      });

    expect(response.status).toBe(200);

    const tokens =
      await PasswordResetToken.find();

    expect(tokens.length).toBe(1);
  });
});