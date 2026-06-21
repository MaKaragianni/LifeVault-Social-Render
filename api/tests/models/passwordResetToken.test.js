require("../mongodb_helper");

const User = require("../../models/user");
const PasswordResetToken =
  require("../../models/PasswordResetToken");

describe("PasswordResetToken Model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await PasswordResetToken.deleteMany({});
  });

  test("creates token", async () => {
    const user = await User.create({
      email: "reset@test.com",
      password: "12345678",
      username: "resetuser",
      dateOfBirth: new Date("1995-01-01"),
    });

    const token =
      await PasswordResetToken.create({
        userId: user._id,
        token: "abc123",
        expiresAt: new Date(
          Date.now() + 10000
        ),
      });

    expect(token.token).toBe("abc123");
  });
});