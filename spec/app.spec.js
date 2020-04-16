process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;

chai.use(require("sams-chai-sorted"));

beforeEach(() => connection.seed.run());

describe("/api", () => {
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
  describe("/articles/:article_id", () => {
    describe("GET", () => {
      it("Responds with an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, comment_count", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles[0].article_id).to.equal(1);
            expect(articles[0].comment_count).to.equal("13");
            articles.forEach((article) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
          });
      });
      it("Returns a 404 error when the article doesn't excist", () => {
        return request(app)
          .get("/api/articles/15")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found for 15");
          });
      });
      it("Respondes with a status:405 when invalid request methods are used", () => {
        const invalidMethods = ["post", "delete", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles/5")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("PATCH", () => {
      it("Accepts an object send in a specific form for a patch request, then returns the article with updated vote count as indicated.", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles[0].article_id).to.equal(5);
            expect(articles[0].votes).to.equal(5);
            articles.forEach((article) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes"
              );
            });
          });
      });
      it("Returns a 400 and a bad request error message if the key is not correct", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ This_is_not_ok: 5 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Returns a 404 error when the article doesn't excist", () => {
        return request(app)
          .get("/api/articles/115")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found for 115");
          });
      });
      it("Returns a 400 error when passed an object with an invalid value", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: "I am not a number" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
    });
  });
  describe("/articles/:article_id/comments", () => {
    describe("POST", () => {
      it("Returns a 201 status and adds a new comment to an article, then send the comment back", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "WHAT A LOAD OF BULL****" })
          .expect(201)

          .then(({ body: { comment } }) => {
            expect(comment[0].comment_id).to.equal(19);
            expect(comment[0].body).to.equal("WHAT A LOAD OF BULL****");
            expect(comment[0]).to.contain.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body",
              "article_id"
            );
            expect(comment[0].author).to.equal("rogersop");
          });
      });
      it("Returns a 400 status and a bad request error message if a key is not correct", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "rogersop",
            THIS_DOES_NOT_WORK: "WHAT A LOAD OF BULL****",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Returns a 400 status and a error message if the username does not exist", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "Bertus557",
            body: "WHAT A LOAD OF BULL****",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Returns a 404 status and a error message if the article_id does not exist", () => {
        return request(app)
          .post("/api/articles/500/comments")
          .send({
            username: "Bertus557",
            body: "WHAT A LOAD OF BULL****",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
    });
    describe("GET", () => {
      it("Returns a status 200, and an array of comments for given article id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments.length).to.equal(13);
            comments.forEach((comment) => {
              expect(comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
            expect(comments).to.be.descendingBy("created_at");
          });
      });
      it("Can you queries to return a status 200, and an array of comments for given article id ", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments.length).to.equal(13);
            comments.forEach((comment) => {
              expect(comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
            expect(comments).to.be.descendingBy("votes");
          });
      });
      it("Can you queries to return a status 200, and an array of comments for given article id ", () => {
        return request(app)
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments.length).to.equal(13);
            comments.forEach((comment) => {
              expect(comment).to.contain.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
            expect(comments).to.be.ascendingBy("created_at");
          });
      });
      it("Returns a 400 status and a error message if the sort column doesn't exist", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=this_doesnt_work")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Returns a 404 status and a error message if the article id doesn't exist", () => {
        return request(app)
          .get("/api/articles/500/comments?order=this_doesnt_work")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found for article_id: 500");
          });
      });
      it("Returns a 400 status and a error message if the sort column doesn't exist", () => {
        return request(app)
          .get("/api/articles/twohundred/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("Responds with a 200 status and an articles array that includes article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            articles.forEach((article) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
            expect(articles).to.be.descendingBy("created_at");
          });
      });
      it("Responds with an array of articles sorted according to queries", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles).to.be.descendingBy("title");
          });
      });
      it("Responds with an array of articles sorted according to queries", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles).to.be.sortedBy("created_at");
          });
      });
      it("Responds with an 400 status code and error message when passed an invalid sort column", () => {
        return request(app)
          .get("/api/articles?sort_by=asc")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it.only("Responds to an author query and returns an array of articles by queried author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            articles.forEach((article) => {
              expect(article.author).to.equal("butter_bridge");
              expect(articles.length).to.equal(3);
            });
          });
      });
      it("Responds with an 404 status code and error message when passed an invalid author query", () => {
        return request(app)
          .get("/api/articles?author=bertus")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Not found");
          });
      });
      it("Responds with an 404 status code and error message when passed an existing author with no articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No articles found by lurker / undefined");
          });
      });
      it("Responds to an topic query and returns an array of articles by queried topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            articles.forEach((article) => {
              expect(article.topic).to.equal("mitch");
              expect(articles.length).to.equal(11);
            });
          });
      });
      it("Responds with an 404 status code and error message when passed an existing topic with no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No articles found by undefined / paper");
          });
      });
    });
  });
});
