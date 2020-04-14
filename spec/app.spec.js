process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;

describe("/api", () => {
  after(() => connection.destroy());
  describe("/topics", () => {
    it("responds with an array of topic objects, each of which should have the following properties", () => {
      return request(app).get("/api/topics").expect(200);
    });
  });
});
