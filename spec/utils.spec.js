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

describe("makeRefObj", () => {});

describe("formatComments", () => {});
