require("../mongodb_helper");

const User = require("../../models/user");
const FriendRequest = require("../../models/FriendRequest");

describe("FriendRequest Model", () => {
  beforeEach(async () => {
    await FriendRequest.deleteMany({});
    await User.deleteMany({});
  });

  test("creates pending request", async () => {
    const sender = await User.create({
      email: "sender@test.com",
      password: "12345678",
      username: "sender",
      dateOfBirth: new Date("1990-01-01"),
    });

    const receiver = await User.create({
      email: "receiver@test.com",
      password: "12345678",
      username: "receiver",
      dateOfBirth: new Date("1990-01-01"),
    });

    const request = await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
    });

    expect(request.status).toBe("pending");
  });

  test("stores sender and receiver ids", async () => {
    const sender = await User.create({
      email: "s@test.com",
      password: "12345678",
      username: "sender2",
      dateOfBirth: new Date("1990-01-01"),
    });

    const receiver = await User.create({
      email: "r@test.com",
      password: "12345678",
      username: "receiver2",
      dateOfBirth: new Date("1990-01-01"),
    });

    const request = await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
    });

    expect(request.sender.toString())
      .toBe(sender._id.toString());

    expect(request.receiver.toString())
      .toBe(receiver._id.toString());
  });
});