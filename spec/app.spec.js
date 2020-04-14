process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");

describe("/api", () => {
  describe("/topics", () => {
    it("responds with an array of topic objects, each of which should have the following properties", () => {
      return request(app).get("/api/topics").expect(200);
    });
  });
});
