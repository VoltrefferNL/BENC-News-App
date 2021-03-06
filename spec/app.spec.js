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
  describe("/", () => {
    describe("GET", () => {
      it("Responds with statuscode 200, and a JSON with all possible endpoints on the server", () => {
        return request(app)
          .get("/api/")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("object");
            expect(body).to.contain.keys(
              "GET /api",
              "GET /api/topics",
              "GET /api/articles",
              "GET /api/articles/:article_id",
              "PATCH /api/articles/:article_id",
              "POST /api/articles/:article_id/comments",
              "GET /api/articles/:article_id/comments",
              "GET /api/users:username",
              "PATCH /api/comments/:comment_id",
              "DELETE /api/comments/:comment_id"
            );
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
        const invalidMethods = ["post", "delete", "patch", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("Responds with statuscode 200, and an array of topic objects, each topic should have the following properties: description, slug", () => {
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
      it("Responds with statuscode 404, and an error message when path isn't correct", () => {
        return request(app)
          .get("/api/topicz")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Not Found dev err");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
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
      it("Responds with statuscode 200, and a user object with the following properties: username, avatar_url, name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an("object");
            expect(user).to.have.all.keys("username", "avatar_url", "name");
            expect(user.username).to.equal("rogersop");
          });
      });
      it("Responds with statuscode 404, and an error message when the user doesn't excist", () => {
        return request(app)
          .get("/api/users/bert5")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No user found for bert5");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
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
      it("Responds with statuscode 200, and a article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, comment_count", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.article_id).to.equal(1);
            expect(article.comment_count).to.equal("13");
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
      it("Responds with statuscode 404, and an error message when the article doesn't excist", () => {
        return request(app)
          .get("/api/articles/15")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found for 15");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
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
      it("Accepts an object send in a specific form for a patch request, then responds with statuscode 200, and an article with updated vote count as indicated.", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.article_id).to.equal(5);
            expect(article.votes).to.equal(5);
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
      it("Responds with statuscode 200, and an unchanged article message if the key is not correct or missing", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({})
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("object");
            expect(article.article_id).to.equal(5);
            expect(article.votes).to.equal(0);
          });
      });
      it("Responds with statuscode 404, and an error when the article doesn't excist", () => {
        return request(app)
          .get("/api/articles/115")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found for 115");
          });
      });
      it("Responds with statuscode 400, when passed an object with an invalid value", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: "I am not a number" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
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
  });
  describe("/articles/:article_id/comments", () => {
    describe("POST", () => {
      it("Accepts an object send in a specific form for a post request, then responds with statuscode 201, and adds a new comment to an article, then sends the comment back", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "WHAT A LOAD OF BULL****" })
          .expect(201)

          .then(({ body: { comment } }) => {
            expect(comment.comment_id).to.equal(19);
            expect(comment.body).to.equal("WHAT A LOAD OF BULL****");
            expect(comment).to.contain.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body",
              "article_id"
            );
            expect(comment.author).to.equal("rogersop");
          });
      });
      it("Responds with statuscode 400, and a bad request error message if a key is not correct", () => {
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
      it("Responds with statuscode 404, and a error message if the username does not exist", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "Bertus557",
            body: "WHAT A LOAD OF BULL****",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Value not found");
          });
      });
      it("Responds with statuscode 404, and a error message if the article_id does not exist", () => {
        return request(app)
          .post("/api/articles/500/comments")
          .send({
            username: "Bertus557",
            body: "WHAT A LOAD OF BULL****",
          })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Value not found");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
        const invalidMethods = ["patch", "delete", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles/5/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("GET", () => {
      it("Responds with statuscode 200, and an array of comments for given article id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments.length).to.equal(10);
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
      it("Responds with statuscode 200, and an array of comments for given article id sorted by query entry", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments.length).to.equal(10);
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
      it("Responds with statuscode 200, and an array of comments for given article id order by query entry", () => {
        return request(app)
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
            expect(comments.length).to.equal(10);
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
      it("Responds with statuscode 400, and a error message if the sort column doesn't exist", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=this_doesnt_work")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 200, and an empty array if the article id doesn't exist", () => {
        return request(app)
          .get("/api/articles/500/comments?order=this_doesnt_work")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an("array");
          });
      });
      it("Responds with statuscode 400, and a error message if the article id isn't properly formatted", () => {
        return request(app)
          .get("/api/articles/twohundred/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
        const invalidMethods = ["patch", "delete", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles/5/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("Responds with statuscode 200, and a page of articles with a default limit set to 10", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(10);
          });
      });
      it("Responds with statuscode 200, takes a page query and responds with the articles from that page", () => {
        return request(app)
          .get("/api/articles/1/comments?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(3);
          });
      });
      it("Responds with statuscode 200, takes a page query and responds with an empty array when page query is too high", () => {
        return request(app)
          .get("/api/articles/1/comments?p=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(0);
          });
      });
      it("Responds with statuscode 400, and an message Bad request", () => {
        return request(app)
          .get("/api/articles/1/comments?p=abc")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 200: and a limited list of articles according to query input", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(5);
          });
      });
      it("Responds with statuscode 400: If the limit query is not an integer", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=a")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("Responds with statusocde 400: and an error message when query isn't in the correct format", () => {
        return request(app)
          .get("/api/articles/1/comments?p=8.1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("Responds with statuscode 200, and an articles array that includes article objects", () => {
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
      it("Responds with statuscode 200, and an array of articles sorted according to query entry", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles).to.be.descendingBy("title");
          });
      });
      it("Responds with statuscode 200, and an array of articles ordered according to query entry", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles).to.be.sortedBy("created_at");
          });
      });
      it("Responds with statuscode 400, and an error message when passed an invalid sort column", () => {
        return request(app)
          .get("/api/articles?sort_by=asc")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 200, and returns an array of articles by query author", () => {
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
      it("Responds with statuscode 404, and an error message when passed an invalid author query", () => {
        return request(app)
          .get("/api/articles?author=bertus")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              "No articles found with either topic or author."
            );
          });
      });
      it("Responds with statuscode 200, and an empty array when passed an existing author with no articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles.length).to.equal(0);
          });
      });
      it("Responds with statuscode 200, and returns an array of articles by query topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            articles.forEach((article) => {
              expect(article.topic).to.equal("mitch");
              expect(articles.length).to.equal(10);
            });
          });
      });
      it("Responds with statuscode 200, and an empty array when passed an existing topic with no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles.length).to.equal(0);
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
        const invalidMethods = ["patch", "delete", "put", "post"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles/")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("Responds with statuscode 200, and a page of articles with a default limit set to 10", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(10);
          });
      });
      it("Responds with statuscode 200, takes a page query and responds with the articles from that page", () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(2);
          });
      });
      it("Responds with statuscode 200, takes a page query and responds with an empty array when page query is too high", () => {
        return request(app)
          .get("/api/articles?p=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(0);
          });
      });
      it("Responds with statuscode 400, and an message Bad request", () => {
        return request(app)
          .get("/api/articles?p=abc")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("responds with statuscode 200: total_count is the total count regardless of the limit used", () => {
        return request(app)
          .get("/api/articles?limit=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.equal("12");
          });
      });
      it("Responds with statuscode 200: and a limited list of articles according to query input", () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(5);
          });
      });
      it("Responds with statuscode 400: If the limit query is not an integer", () => {
        return request(app)
          .get("/api/articles?limit=a")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("Responds with statusocde 400: and an error message when query isn't in the correct format", () => {
        return request(app)
          .get("/api/articles?p=8.1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
    });
  });
  describe("/comments/:comment_id", () => {
    describe("PATCH", () => {
      it("Accepts an object send in a specific form for a patch request, then responds with statuscode 200, and a comment with updated vote count as indicated.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
            expect(comment.comment_id).to.equal(1);
            expect(comment.votes).to.equal(17);
            expect(comment).to.have.all.keys(
              "comment_id",
              "votes",
              "article_id",
              "created_at",
              "author",
              "body"
            );
          });
      });
      it("Responds with statuscode 404, when passed a comment_id that does not exist ", () => {
        return request(app)
          .patch("/api/comments/500")
          .send({
            inc_votes: 1,
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No comment found for 500");
          });
      });
      it("Responds with statuscode 400, when passed a comment_id in an invalid format", () => {
        return request(app)
          .patch("/api/comments/b4500")
          .send({
            inc_votes: 1,
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 400, when passed an invalid value in the send body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({
            inc_votes: "B1",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 200, when passed an invalid key in the send body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({
            inc_votesasd: 1,
          })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an("object");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
        const invalidMethods = ["post", "get", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("DELETE", () => {
      it("Responds with statuscode 204, when passed a valid delete command", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(() => {
            return connection("comments").where({ comment_id: 1 });
          })
          .then((comments) => {
            expect(comments.length).to.equal(0);
          });
      });
      it("Responds with a statuscode 404, when the comment_id is non-excistend", () => {
        return request(app)
          .delete("/api/comments/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No comment found for 1000");
          });
      });
      it("Responds with a statuscode 400, when the comment_id is not valid", () => {
        return request(app)
          .delete("/api/comments/A1000")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("Responds with statuscode 405, and an error message when invalid request methods are used", () => {
        const invalidMethods = ["post", "get", "put"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/comments/1")
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
