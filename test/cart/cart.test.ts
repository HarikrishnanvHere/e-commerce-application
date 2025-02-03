import request from "supertest";
import { app, server } from "../../src/index";

jest.mock("jsonwebtoken", () => ({
  verify: () => {
    return {
      userId: 13,
    };
  },
}));

describe("cart Model Tests", () => {
  it("should add the product to the cart along with its quantity", async () => {
    const actual = await request(app).post("/api/cart/").set({ authorization: "abc" }).send({
      productId: 2,
      quantity: 3,
    });
    //console.log(actual);
    expect(actual.status).toBe(200);
    expect(actual.body.productId).toBe(2);
  });

  it("if the product is already present in the cart, it should update the quantity only", async () => {
    const actual1 = await request(app).post("/api/cart/").set({ authorization: "abc" }).send({
      productId: 10,
      quantity: 3,
    });
    const actual2 = await request(app).post("/api/cart/").set({ authorization: "abc" }).send({
      productId: 10,
      quantity: 3,
    });

    //console.log(actual);
    expect(actual2.status).toBe(200);
    expect(actual2.body.quantity).toBe(6);
  });

  it("should updat ethe quantity of the particular product present in the cart", async () => {
    const actual = await request(app).put("/api/cart/13").set({ authorization: "abc" }).send({
      quantity: 10,
    });
    expect(actual.status).toBe(200);
    expect(actual.body.productId).toBe(2);
  });

  it("should delete the product from the cart ", async () => {
    const actual = await request(app).delete("/api/cart/18").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body.success).toBe(true);
  });

  it("should return the list of products present in the cart", async () => {
    const actual = await request(app).get("/api/cart").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body).toBeInstanceOf(Array);
  });

  afterAll((done) => {
    server.close(done); // Ensure the server is closed after tests
  });
});
