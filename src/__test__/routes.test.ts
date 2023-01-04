import supertest from "supertest";
import app from "../server";

describe("GET /", () => {
  it("should send back some data", async () => {
    const res = supertest(app).get("/");

    expect((await res).body.hello).toBe("world");
  });
});
