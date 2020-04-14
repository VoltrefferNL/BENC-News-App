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
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
