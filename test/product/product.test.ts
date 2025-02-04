import request from "supertest";
import { app, prismaClient, server } from "../../src/index";

jest.mock("jsonwebtoken", () => ({
  verify: () => {
    return {
      userId: 13,
    };
  },
}));

const spy = jest.spyOn(prismaClient.product, "create").mockResolvedValue({
  name: "Bottle",
  description: "Plastic WaterBottle",
  price: "100",
  tags: ["Blue", "Not-Breakable", "One litre"],
} as any);

const spy2 = jest.spyOn(prismaClient.product, "delete").mockResolvedValue({
  name: "Bottle",
  description: "Plastic WaterBottle",
  price: "100",
  tags: ["Blue", "Not-Breakable", "One litre"],
} as any);

describe("Product Model Tests", () => {
  it("should create the product and return the created data", async () => {
    const actual = await request(app)
      .post("/api/products/")
      .set({ authorization: "abc" })
      .send({
        name: "Bottle",
        description: "Plastic WaterBottle",
        price: "100",
        tags: ["Blue", "Not-Breakable", "One litre"],
      });
    //console.log(actual);
    expect(actual.status).toBe(200);
    expect(actual.body.name).toBe("Bottle");

    spy.mockRestore();
  });

  it("should return the edited product", async () => {
    const actual = await request(app).put("/api/products/16").set({ authorization: "abc" }).send({
      price: "150",
    });
    expect(actual.status).toBe(200);
    expect(actual.body.price).toBe("150");
  });

  it("should return error if there is no product to edit or update", async () => {
    const actual = await request(app).put("/api/products/10005").set({ authorization: "abc" }).send({
      price: "150",
    });
    expect(actual.status).toBe(404);
  });

  it("should return the particular product", async () => {
    const actual = await request(app).get("/api/products/12").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body.name).toBe("Jacket");
  });

  it("should return error if there is no product to return", async () => {
    const actual = await request(app).get("/api/products/10005").set({ authorization: "abc" });
    expect(actual.status).toBe(404);
  });

  it("should delete the product and return its details", async () => {
    const actual = await request(app).delete("/api/products/20").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body.name).toBe("Bottle");
    spy2.mockRestore();
  });

  it("should return error if the product to delete is not found in the database", async () => {
    const actual = await request(app).delete("/api/products/20005").set({ authorization: "abc" });
    expect(actual.status).toBe(404);
  });

  it("should return the list of products", async () => {
    const actual = await request(app).get("/api/products?skip=3").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body.data).toBeInstanceOf(Array);
  });

  afterAll((done) => {
    server.close(done); // Ensure the server is closed after tests
  });
});
