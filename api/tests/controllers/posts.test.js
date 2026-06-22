const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET || "test-secret";
const mongoose = require("mongoose");

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let user;
let token;

describe("/posts", () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Post.deleteMany();

    user = await User.create({
      email: "post-test@test.com",
      password: "12345678",
      username: "test-user",
      dateOfBirth: "2000-01-01"
    });
    token = createToken(user.id);
  });

  afterAll(async () => {
    await User.deleteMany();
    await Post.deleteMany();
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a new post with text", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
      expect(posts[0].image).toEqual("");
    });

    test("creates a new post containing an attached photo URL string", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ 
          message: "Loving my brand new camera!", 
          image: "https://res.cloudinary.com/dg1scdvos/image/upload/sample.png" 
        });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Loving my brand new camera!");
      expect(posts[0].image).toEqual("https://res.cloudinary.com/dg1scdvos/image/upload/sample.png");
    });

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ message: "I love all my children equally", user: user._id });
      const post2 = new Post({ message: "I've never cared for GOB", user: user._id });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection including attachments", async () => {
      const post1 = new Post({ message: "howdy!", user: user._id });
      const post2 = new Post({ 
        message: "look at my cat!", 
        image: "https://res.cloudinary.com/dg1scdvos/cat.png", 
        user: user._id 
      });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      const messages = posts.map(post => post.message);
      const images = posts.map(post => post.image);

      expect(messages).toContain("howdy!");
      expect(messages).toContain("look at my cat!");
      expect(images).toContain("https://res.cloudinary.com/dg1scdvos/cat.png");
    });
  });

  describe("POST /posts/:id/like", () => {
    test("a user can like a post", async () => {
      const post = await Post.create({
        message: "Test post",
        user: user._id,
        likes: [],
      });

      const response = await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body.likes.length).toEqual(1);
    });

    test("a user can unlike a post", async () => {
      const post = await Post.create({
        message: "Test post for unlikes",
        user: user._id,
        likes: [user._id],
      });

      const response = await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`); 

      expect(response.status).toEqual(200);
      expect(response.body.likes.length).toEqual(0);
    });
  });
});