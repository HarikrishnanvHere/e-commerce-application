import request from "supertest";
import { app, prismaClient, server } from "../../src/index";

// Create a mock Prisma client

const mockUser = { name: "abc", email: "abcde.rko@gmail.com", password: "abcdefghi" };

const spy = jest.spyOn(prismaClient.user, "create").mockResolvedValue({
  name: "abc",
  email: "abcde.rko@gmail.com",
  password: "abcdefghi",
} as any);

jest.mock("jsonwebtoken", () => ({
  sign: () => {
    return "123";
  },
  verify: () => {
    return {
      userId: 13,
    };
  },
}));

describe("User model tests", () => {
  describe("TestCase for Creation of User", () => {
    it("should create the user and return the created data", async () => {
      const actual = await request(app).post("/api/auth/signup").send(mockUser);
      //console.log(actual.body);
      expect(actual.status).toBe(200);
      expect(actual.body.name).toBe("abc");
      spy.mockRestore();
    });

    it("should return error if the data is already present", async () => {
      const actual = await request(app).post("/api/auth/signup").send({
        name: "abc",
        email: "abcde.rko@gmail.com",
        password: "abcdefghi",
      });
      console.log(actual);
      expect(actual.status).toBe(500);
    });
  });

  describe("TestCase for Log-in", () => {
    it("should login the user and return token", async () => {
      const actual = await request(app).post("/api/auth/login").send({
        email: "itsmeharikrishnanv@gmail.com",
        password: "123123123",
      });
      //console.log(actual);
      expect(actual.status).toBe(200);
      expect(actual.body.token).toBe("123");
    });

    it("should return error if login credentials are false", async () => {
      const actual = await request(app).post("/api/auth/login").send({
        password: "abcdefghi",
      });
      //console.log(actual);
      expect(actual.status).toBe(400);
    });
  });

  describe("TestCase finding out the user who is currently logged in.", () => {
    it("should return the logged in user", async () => {
      const actual = await request(app).get("/api/auth/me").set({ authorization: "abc" });
      //console.log(actual);
      expect(actual.status).toBe(200);
      expect(actual.body.name).toBe("harikrishnan");
    });
  });
  afterAll((done) => {
    server.close(done); // Ensure the server is closed after tests
  });
});
