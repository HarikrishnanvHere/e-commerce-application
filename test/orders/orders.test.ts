import request from "supertest";
import { app, prismaClient, server } from "../../src/index";
let orderId: string;

jest.mock("jsonwebtoken", () => ({
  verify: () => {
    return {
      userId: 13,
    };
  },
}));

const spy = jest.spyOn(prismaClient.cartItem, "create").mockResolvedValue({
  name: "Bottle",
  description: "Plastic WaterBottle",
  price: "100",
  tags: ["Blue", "Not-Breakable", "One litre"],
} as any);

const spy2 = jest.spyOn(prismaClient.cartItem, "deleteMany").mockResolvedValue({
  name: "Bottle",
  description: "Plastic WaterBottle",
  price: "100",
  tags: ["Blue", "Not-Breakable", "One litre"],
} as any);

const spy3 = jest.spyOn(prismaClient.user, "update").mockResolvedValue({
  name: "Bottle",
  description: "Plastic WaterBottle",
  price: "100",
  tags: ["Blue", "Not-Breakable", "One litre"],
} as any);

describe("Order Model Tests", () => {
  it("should create the order and return the order id", async () => {
    const actual = await request(app).get("/api/order/").set({ authorization: "abc" });
    //console.log(actual);
    expect(actual.status).toBe(200);
    orderId = actual.body;
    // expect(actual.body).toBeTruthy();
  });

  it("should complete the payment if there is a payment id and return the appropriate message", async () => {
    const actual = await request(app).post("/api/order/").set({ authorization: "abc" }).send({
      order_id: orderId,
      payment_id: "abc",
    });
    //console.log(actual);
    expect(actual.body.message).toBe("Order Placed Successfully!");
  });

  it("should not complete the payment if there is no payment id", async () => {
    const actual = await request(app).post("/api/order/").set({ authorization: "abc" }).send({
      order_id: orderId,
    });

    expect(actual.body.message).toBe("transaction failed!");
  });

  it("should fetch the list of ordered items", async () => {
    const actual = await request(app).get("/api/order/get/").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body).toBeInstanceOf(Array);
  });

  afterAll((done) => {
    server.close(done); // Ensure the server is closed after tests
  });
});
