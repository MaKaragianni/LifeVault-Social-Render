const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;
const mongoose = require("mongoose");

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let user1, user2;
let token;

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", password: "1234", confirmPassword: "1234" });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "1234", confirmPassword: "1234" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });


/* Added integration test cases for GET /users/:id to cover
the User profile page logic.
*/
  describe("GET /:id", () => {
    test("responds with 200 and custom profile data if user exists", async () => {
      const user = new User({
        email: "profile-test@example.com",
        password: "password123",
        username: "testworker",
        bio: "Software Engineer in London",
        profilePic: "uploads/mock-pic.png"
      });
      await user.save();

      const response = await request(app).get(`/users/${user._id}`);

      expect(response.statusCode).toBe(200);
      
      // Target the data wrapper safely
      const responseUser = response.body.user || response.body;

      expect(responseUser.email).toEqual("profile-test@example.com");
      expect(responseUser.username).toEqual("testworker");
      expect(responseUser.bio).toEqual("Software Engineer in London");
      expect(responseUser.profilePic).toEqual("uploads/mock-pic.png");
    });

    test("responds with 404 if the user id string does not exist", async () => {
      const nonExistentId = "60c72b2f9b1d8b2bad6e1a2c"; 
      const response = await request(app).get(`/users/${nonExistentId}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /users/search", () => {
    test("responds with 200 and user data if username exists", async () => {
      const user1 = await User.create({
        email: "user1@test.com",
        password: "Password1!",
        username: "User1",
      });

      const response = await request(app)
        .get("/users/search")
        .query({ username: "User1"});

      expect(response.statusCode).toBe(200);
      expect(response.body[0].username).toEqual("User1");
    });

    test("responds with 404 if user not found", async () => {
      const response = await request(app)
        .get("/users/search")
        .query({ username: "User2"});

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual("User not found");
    });
  });

  describe("POST /users/:id/handlefollow", () => {
    it("should allow a user to follow another user", async () => {
      user1 = new User ({
        email: "user1@test.com",
        password: "Password1!",
        username: "User1",
      });
      user2 = new User ({
        email: "user2@test.com",
        password: "Password2!",
        username: "User2",
      });
      token = createToken(user1.id);
      await user1.save();
      await user2.save();
      
      const response = await request(app)
        .post(`/users/${user2._id}/handlefollow`)
        .set("Authorization", `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Followed");
    });

    it("should allow a user to unfollow another user", async () => {
      user1 = new User ({
        email: "user1@test.com",
        password: "Password1!",
        username: "User1",
      });
      user2 = new User ({
        email: "user2@test.com",
        password: "Password2!",
        username: "User2",
      });
      token = createToken(user1.id);
      user1.friends.addToSet(user2._id);
      await user1.save()
      await user2.save()
    
      const response = await request(app)
        .post(`/users/${user2._id}/handlefollow`)
        .set("Authorization", `Bearer ${token}`);
    
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Unfollowed");
    });
  });
});