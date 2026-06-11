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
});
