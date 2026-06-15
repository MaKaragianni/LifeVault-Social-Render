require("../mongodb_helper");

const Post = require("../../models/post");
const User = require("../../models/user");
const mongoose = require("mongoose");

let user;

describe("Post model", () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it("has a message", () => {
    const post = new Post({ message: "some message",  });
    expect(post.message).toEqual("some message");
  });

  it("can list all posts", async () => {
    const posts = await Post.find();
    expect(posts).toEqual([]);
  });

  it("can save a post", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const post = new Post({ message: "some message", user: fakeUserId});

    await post.save();
    const posts = await Post.find();
    expect(posts[0].message).toEqual("some message");
  });
});
