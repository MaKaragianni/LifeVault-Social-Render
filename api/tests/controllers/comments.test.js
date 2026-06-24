const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET || "test-secret";

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
let user2;
let token;
let token2;
let post;

describe("/posts/:id/comments", () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    user = await User.create({
      email: "comment-test@test.com",
      password: "12345678",
      username: "commenter",
      dateOfBirth: "2000-01-01",
    });

    user2 = await User.create({
      email: "commenter2@test.com",
      password: "12345678",
      username: "commenter2",
      dateOfBirth: "2000-01-01",
    });

    token = createToken(user.id);
    token2 = createToken(user2.id);

    post = await Post.create({
      message: "A post to comment on",
      user: user._id,
    });
  });

  afterAll(async () => {
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
  });

  describe("POST /:id/comments — create a comment", () => {
    test("responds with 201 and the new comment", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Great post!" });

      expect(response.status).toEqual(201);
      expect(response.body.comment.message).toEqual("Great post!");
    });

    test("comment is saved to the database", async () => {
      await request(app)
        .post(`/posts/${post._id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Saved comment" });

      const comments = await Comment.find({ post: post._id });
      expect(comments.length).toEqual(1);
      expect(comments[0].message).toEqual("Saved comment");
    });

    test("new comment has an empty likes array", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "No likes yet" });

      expect(response.body.comment.likes).toEqual([]);
    });

    test("responds with 400 when message is empty", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "  " });

      expect(response.status).toEqual(400);
    });

    test("responds with 401 when no token is provided", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments`)
        .send({ message: "Unauthorised" });

      expect(response.status).toEqual(401);
    });
  });

  describe("POST /:id/comments/:commentId/like — like a comment", () => {
    let comment;

    beforeEach(async () => {
      comment = await Comment.create({
        message: "A likeable comment",
        user: user._id,
        post: post._id,
        likes: [],
      });
    });

    test("responds with 200 when liking a comment", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token2}`);

      expect(response.status).toEqual(200);
    });

    test("adds the user's ID to the comment's likes array", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token2}`);

      expect(response.body.comment.likes.length).toEqual(1);
    });

    test("a second request from the same user unlikes the comment", async () => {
      // Like first
      await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token2}`);

      // Unlike
      const response = await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token2}`);

      expect(response.status).toEqual(200);
      expect(response.body.comment.likes.length).toEqual(0);
    });

    test("two different users can both like the same comment", async () => {
      await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const response = await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token2}`);

      expect(response.body.comment.likes.length).toEqual(2);
    });

    test("like count is persisted in the database", async () => {
      await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`)
        .set("Authorization", `Bearer ${token2}`);

      const updated = await Comment.findById(comment._id);
      expect(updated.likes.length).toEqual(1);
    });

    test("responds with 401 when no token is provided", async () => {
      const response = await request(app)
        .post(`/posts/${post._id}/comments/${comment._id}/like`);

      expect(response.status).toEqual(401);
    });

    test("responds with 404 for a non-existent comment", async () => {
      const fakeId = "000000000000000000000001";
      const response = await request(app)
        .post(`/posts/${post._id}/comments/${fakeId}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(404);
    });
  });
});

describe("PUT /:id/comments/:commentId", () => {
  let comment;

  beforeEach(async () => {
    comment = await Comment.create({
      message: "Original comment",
      user: user._id,
      post: post._id,
    });
  });

  test("updates a comment", async () => {
    const response = await request(app)
      .put(`/posts/${post._id}/comments/${comment._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: "Updated comment",
      });

    expect(response.status).toEqual(200);
    expect(response.body.comment.message).toEqual("Updated comment");
  });

  test("persists comment updates to the database", async () => {
    await request(app)
      .put(`/posts/${post._id}/comments/${comment._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: "Persisted update",
      });

    const updated = await Comment.findById(comment._id);

    expect(updated.message).toEqual("Persisted update");
  });
});