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

describe.only("makeRefObj", () => {
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

describe("formatComments", () => {});
