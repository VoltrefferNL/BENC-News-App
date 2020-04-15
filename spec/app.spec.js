process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;

chai.use(require("sams-chai-sorted"));

beforeEach(() => connection.seed.run());

describe.only("/api", () => {
  after(() => connection.destroy());
  describe("/topics", () => {
    describe("GET", () => {
      it("responds with an array of topic objects, each of which should have the following properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body).to.include.keys("topics");
            body.topics.forEach((topic) => {
              expect(topic).to.have.all.keys("description", "slug");
            });
            expect(body.topics).to.be.ascendingBy("description");
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
        const invalidMethods = ["patch", "post", "delete", "put"];
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
  describe("/users/:username", () => {
    describe("GET", () => {
      it("Responds with an 200 status and a user object with the following proerties: username, avatar_url, name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).to.be.an("array");
            expect(users[0]).to.have.all.keys("username", "avatar_url", "name");
            expect(users[0].username).to.equal("rogersop");
          });
      });
      it("Returns a 404 error when the user doesn't excist", () => {
        return request(app)
          .get("/api/users/bert5")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No user found for bert5");
          });
      });
      it("Respondes with a status:405 when invalid request methods are used", () => {
        const invalidMethods = ["patch", "post", "delete", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/users/rogersop")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});
