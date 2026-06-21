const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");

const User = require("../../models/user");
const FriendRequest =
  require("../../models/FriendRequest");

require("../mongodb_helper");

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp:
        Math.floor(Date.now() / 1000) + 600,
    },
    process.env.JWT_SECRET
  );
}

describe("Friend Requests", () => {
  let sender;
  let receiver;
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await FriendRequest.deleteMany({});

    sender = await User.create({
      email: "sender@test.com",
      password: "12345678",
      username: "sender",
      dateOfBirth: new Date("1990-01-01"),
    });

    receiver = await User.create({
      email: "receiver@test.com",
      password: "12345678",
      username: "receiver",
      dateOfBirth: new Date("1990-01-01"),
    });

    token = createToken(sender._id);
  });

  test("creates friend request", async () => {
    const response = await request(app)
      .post(
        `/friendRequests/request/${receiver._id}`
      )
      .set(
        "Authorization",
        `Bearer ${token}`
      );

    expect(response.status).toBe(201);

    const requests =
      await FriendRequest.find();

    expect(requests.length).toBe(1);
  });
});