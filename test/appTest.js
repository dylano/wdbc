const assert = require("chai").assert;
const app = require("../app.js");

describe("App", () => {
  it("must be true", () => {
    assert.isTrue(app.sanityTest());
  });
});
