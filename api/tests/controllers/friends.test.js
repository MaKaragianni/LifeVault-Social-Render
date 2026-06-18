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

describe("GET /users/friends", () => {
    beforeEach(async () => {
        await User.deleteMany({});
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
    });

    it("should return a list of friends for the logged in user", async () => {
        user1.friends.addToSet(user2._id);
        await user1.save();

        const response = await request(app)
            .get("/friends")
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.friends)).toBe(true);
        expect(response.body.friends.length).toBe(1);
        expect(response.body.friends[0]._id).toBe(user2._id.toString());
    });

    it("should return an empty list if the user has no friends", async () => {
        const response = await request(app)
            .get("/friends")
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.friends).toEqual([]);
    });
});