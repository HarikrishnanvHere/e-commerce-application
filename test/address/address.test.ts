import request from "supertest";
import { app, server } from "../../src/index";

jest.mock("jsonwebtoken", () => ({
  verify: () => {
    return {
      userId: 13,
    };
  },
}));

describe("Address Model Tests", () => {
  it("should store the address and return the stored data", async () => {
    const actual = await request(app).post("/api/address/").set({ authorization: "abc" }).send({
      lineOne: "no xyz",
      lineTwo: "abc street",
      city: "Indore",
      country: "India",
      pincode: "689124",
    });
    //console.log(actual);
    expect(actual.status).toBe(200);
    expect(actual.body.pincode).toBe("689124");
  });

  it("should throw error if data is incomplete", async () => {
    const actual = await request(app).post("/api/address/").set({ authorization: "abc" }).send({
      lineOne: "no xyz",
      lineTwo: "abc street",
    });
    //console.log(actual);
    expect(actual.status).toBe(400);
  });

  it("should delete the stored address and give back the message - successfully deleted", async () => {
    const actual = await request(app).delete("/api/address/8").set({ authorization: "abc" });
    expect(actual.body.message).toBe("successfully deleted");
    console.log(actual.body);
  });

  it("should fetch the list of addresses", async () => {
    const actual = await request(app).get("/api/address/").set({ authorization: "abc" });
    expect(actual.status).toBe(200);
    expect(actual.body).toBeInstanceOf(Array);
  });

  it("should update the default shipping and default billing address details", async () => {
    const actual = await request(app).put("/api/address/").set({ authorization: "abc" }).send({
      defaultShippingAddress: 11,
      defaultBillingAddress: 11,
    });
    console.log(actual.body);
    // expect(actual.status).toBe(200);
    expect(actual.body.defaultShippingAddress).toBe(11);
  });

  afterAll((done) => {
    server.close(done); // Ensure the server is closed after tests
  });
});
