const assert = require("assert");
const { getIndex } = require("../server/helper/fsHelper");
const layersDir = require("../config").layersDir;
describe("FS Helper", function () {
  it("Get Index", function () {
    getIndex(layersDir);
  });
});
