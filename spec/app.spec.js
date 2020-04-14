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
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          console.log(res.body);
          expect(res.body.topics).to.be.an("array");
        });
    });
    it("Gives an 404 error when path isn't correct", () => {
      return request(app)
        .get("/api/topicz")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Not Found dev err");
        });
    });
    it("Respondes with a status:405 when invalid request methods are used", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
