require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      username: "SomeOne",
      profilePic: "image.png",
      bio: "Testing testing",
      dateOfBirth: new Date("2000-01-01"),
    });

    await user.save();

    const savedUser = await User.find();

    expect(savedUser[0].email).toEqual("someone@example.com");
    expect(savedUser[0].username).toEqual("SomeOne");
    expect(savedUser[0].bio).toEqual("Testing testing");
  });

  it("should be invalid if email is empty", async () => {
    const user = new User({
      email: "",
      password: "password123",
      username: "SomeOne",
      dateOfBirth: new Date("2000-01-01"),
    });

    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }

    expect(err.errors.email).toBeDefined();
  });

  it("should be invalid if password is missing", async () => {
    const user = new User({
      email: "someone@example.com",
      username: "SomeOne",
      dateOfBirth: new Date("2000-01-01"),
    });

    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }

    expect(err.errors.password).toBeDefined();
  });

  it("should not allow duplicate emails", async () => {
    await User.create({
      email: "duplicate@test.com",
      password: "1234",
      username: "UserA",
      dateOfBirth: new Date("2000-01-01"),
    });

    await expect(
      User.create({
        email: "duplicate@test.com",
        password: "5678",
        username: "UserB",
        dateOfBirth: new Date("2000-01-01"),
      })
    ).rejects.toThrow();
  });

  it("should not allow duplicate usernames", async () => {
    await User.create({
      email: "user1@test.com",
      password: "1234",
      username: "SameUser",
      dateOfBirth: new Date("2000-01-01"),
    });

    await expect(
      User.create({
        email: "user2@test.com",
        password: "5678",
        username: "SameUser",
        dateOfBirth: new Date("2000-01-01"),
      })
    ).rejects.toThrow();
  });

  it("sets default values for bio and profilePic", async () => {
    const user = new User({
      email: "default@test.com",
      password: "password123",
      username: "DefaultUser",
      dateOfBirth: new Date("2000-01-01"),
    });

    await user.save();

    const savedUser = await User.find();

    expect(savedUser[0].bio).toEqual("");
    expect(savedUser[0].profilePic).toEqual("");
  });

  it("can add a friend to the friends array", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
      dateOfBirth: new Date("2000-01-01"),
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
      dateOfBirth: new Date("2000-01-01"),
    });

    user1.friends.addToSet(user2._id);
    await user1.save();

    const saved = await User.findById(user1._id);

    expect(saved.friends.length).toBe(1);
  });

  it("can populate friends array", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
      dateOfBirth: new Date("2000-01-01"),
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
      dateOfBirth: new Date("2000-01-01"),
    });

    user1.friends.addToSet(user2._id);
    await user1.save();

    const populated = await User.findById(user1._id).populate("friends");

    expect(populated.friends[0].username).toBe("User2");
  });

  it("prevents duplicate friends", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
      dateOfBirth: new Date("2000-01-01"),
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
      dateOfBirth: new Date("2000-01-01"),
    });

    user1.friends.addToSet(user2._id);
    user1.friends.addToSet(user2._id);

    await user1.save();

    const saved = await User.findById(user1._id);

    expect(saved.friends.length).toBe(1);
  });
});