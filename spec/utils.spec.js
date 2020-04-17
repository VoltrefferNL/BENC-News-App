const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Returns a new array when invoked", () => {
    const unFormattedArticles = [];
    const testFunc = formatDates(unFormattedArticles);
    expect(testFunc).to.eql([]);
    expect(testFunc).to.not.equal(unFormattedArticles);
  });
  it("Does not return the same objects in input array", () => {
    const unFormattedArticles = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const testFunc = formatDates(unFormattedArticles);
    expect(testFunc[0]).to.not.eql(unFormattedArticles[0]);
  });
  it("All new articles have adjusted created_at valuables", () => {
    const unFormattedArticles = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const testFunc = formatDates(unFormattedArticles);
    expect(testFunc[0].created_at).to.not.eql(
      unFormattedArticles[0].created_at
    );
  });
  it("Test that input data is not mutated by function", () => {
    const unFormattedArticles = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const testFunc = formatDates(unFormattedArticles);
    expect(unFormattedArticles).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ]);
  });
});

describe("makeRefObj", () => {
  it("Create a new object when passed an array", () => {
    const emptyArr = [];
    const testFunc = makeRefObj(emptyArr);
    const emptyObj = {};
    expect(testFunc).to.eql(emptyObj);
  });
  it("Takes an array with one entree and returns an object with mutated data", () => {
    const oneEntreeArr = [{ article_id: 1, title: "A" }];
    const resultObj = { A: 1 };
    const testFunc = makeRefObj(oneEntreeArr);
    expect(testFunc).to.eql(resultObj);
  });
  it("Takes an array with multiple entrees and returns an object with mutated data", () => {
    const multipleEntreeArr = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" },
    ];
    const resultObj = { A: 1, B: 2, C: 3 };
    const testFunc = makeRefObj(multipleEntreeArr);
    expect(testFunc).to.eql(resultObj);
  });
});

describe("formatComments", () => {
  it("returns an array when processing inputs", () => {
    const comments = [];
    const articleRef = {};
    const testFunc = formatComments(comments, articleRef);
    expect(testFunc).to.eql([]);
  });
  it("changes created_by property to an author key", () => {
    const comments = [{ created_by: "icellusedkars" }];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const testFunc = formatComments(comments, articleRef);
    expect(testFunc[0]).to.not.include.key("created_by");
    expect(testFunc[0]).to.include({ author: "icellusedkars" });
  });
  it("changes `belongs_to` to `article_id`", () => {
    const comments = [{ belongs_to: "Living in the shadow of a great man" }];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const testFunc = formatComments(comments, articleRef);
    expect(testFunc[0]).to.include.keys("article_id");
    expect(testFunc[0]).to.not.include.keys("belongs_to");
  });
  it("article_id is coresponding with the original title value provided", () => {
    const comments = [
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389,
      },
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const testFunc = formatComments(comments, articleRef);
    expect(testFunc[0]).to.include({ article_id: 1 });
  });
  it("created_at value is converted into a js date object", () => {
    const comments = [
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389,
      },
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const testFunc = formatComments(comments, articleRef);
    expect(testFunc[0].created_at).to.eql(new Date(1416746163389));
  });
  it("retains all other original properties", () => {
    const comments = [
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389,
      },
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const testFunc = formatComments(comments, articleRef);
    expect(testFunc).to.eql([
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        votes: -100,
        created_at: new Date(1416746163389),
        article_id: 1,
        author: "icellusedkars",
      },
    ]);
  });
});
