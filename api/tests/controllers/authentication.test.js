const app = require("../../app");
const supertest = require("supertest");

require("../mongodb_helper");

const User = require("../../models/user");

describe("/tokens", () => {
  beforeAll(async () => {
    await User.deleteMany({});

    await User.create({
      email: "auth-test@test.com",
      password: "12345678",
      username: "authuser",
      dateOfBirth: new Date("1995-01-01"),
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  test("returns token when credentials are valid", async () => {
    const response = await supertest(app)
      .post("/tokens")
      .send({
        email: "auth-test@test.com",
        password: "12345678",
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  test("returns 401 when user does not exist", async () => {
    const response = await supertest(app)
      .post("/tokens")
      .send({
        email: "missing@test.com",
        password: "12345678",
      });

    expect(response.status).toBe(401);
  });

  test("returns 401 when password incorrect", async () => {
    const response = await supertest(app)
      .post("/tokens")
      .send({
        email: "auth-test@test.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
  });
});