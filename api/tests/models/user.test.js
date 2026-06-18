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
      bio: "Testing testing"
    });
    await user.save();

    const savedUser = await User.find();
    expect(savedUser[0].email).toEqual("someone@example.com");
    expect(savedUser[0].password).toEqual("password123");
    expect(savedUser[0].username).toEqual("SomeOne");
    expect(savedUser[0].profilePic).toEqual("image.png");
    expect(savedUser[0].bio).toEqual("Testing testing");
  });

  it("can list all users", async () => {
    const user1 = new User({
      email: "someone@example.com",
      password: "password123",
      username: "SomeOne",
      profilePic: "image.png",
      bio: "Testing testing"
    });
    await user1.save();

    const user2 = new User({
      email: "person@example.com",
      password: "qwerty456",
      username: "Person",
      profilePic: "photo.png",
      bio: "One two one tow"
    });
    await user2.save();

    const users = await User.find();
    expect(users.length).toEqual(2);
  });

  it("should be invalid if email is empty", async () => {
    const user = new User({
      email: "",
      password: "password123",
      username: "SomeOne",
      profilePic: "image.png",
      bio: "Testing testing"
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
      profilePic: "image.png",
      bio: "Testing testing"
    });
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.password).toBeDefined();
  });
  
  it("should be invalid to register an email that is already taken", async () => {
    const user1 = new User({
      email: "someone@example.com",
      password: "password123"
    });
    await user1.save();

    const user2 = new User({
      email: "someone@example.com",
      password: "qwerty456"
    });
    await expect(user2.save()).rejects.toThrow();
  });

  it("should be invalid to register a username that is already taken", async () => {
    const user1 = new User({
      email: "someone@example.com",
      password: "password123",
      username: "SomeOne",
      profilePic: "image.png",
      bio: "Testing testing"
    });
    await user1.save();

    const user2 = new User({
      email: "person@example.com",
      password: "qwerty456",
      username: "SomeOne",
      profilePic: "photo.png",
      bio: "Activist for identity theft"
    });
    await expect(user2.save()).rejects.toThrow();
  });

  it("sets profile pic and bio to empty strings (default) if missing", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "password123",
      username: "SomeOne",
    });
    await user.save();

    const savedUser = await User.find();
    expect(savedUser[0].email).toEqual("someone@example.com");
    expect(savedUser[0].password).toEqual("password123");
    expect(savedUser[0].username).toEqual("SomeOne");
    expect(savedUser[0].profilePic).toEqual("");
    expect(savedUser[0].bio).toEqual("");
  });

  it("can add a friend to the friends array", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
    });

    user1.friends.addToSet(user2._id);
    await user1.save();

    const savedUser = await User.findById(user1._id);
    expect(savedUser.friends).toContainEqual(user2._id);
  });

  it("can populate the friends array with user data", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
    });

    user1.friends.addToSet(user2._id);
    await user1.save();

    const savedUser = await User.findById(user1._id).populate("friends");
    expect(savedUser.friends[0].username).toBe("User2");
  });

  it("should only be possible to add a single friend to the friends array once", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
    });

    user1.friends.addToSet(user2._id);
    user1.friends.addToSet(user2._id);
    await user1.save();

    const savedUser = await User.findById(user1._id);
    expect(savedUser.friends.length).toBe(1);
  });

  it("can remove a friend from the friends array", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
    });

    const user2 = await User.create({
      email: "user2@test.com",
      password: "Password2!",
      username: "User2",
    });

    user1.friends.addToSet(user2._id);
    await user1.save();

    user1.friends.pull(user2._id);
    await user1.save();

    const savedUser = await User.findById(user1._id);
    expect(savedUser.friends).not.toContainEqual(user2._id);
  });

  it("should not be possible for a user to add themself to their own friends array", async () => {
    const user1 = await User.create({
      email: "user1@test.com",
      password: "Password1!",
      username: "User1",
    });

    user1.friends.addToSet(user1._id);
    await expect(user1.save()).rejects.toThrow("You cannot follow yourself");
  });
});
