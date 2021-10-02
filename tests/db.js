var assert = require("assert");
const { db, Image, ImageAttribute, Layer } = require("../models/dbmodels");
describe("Database", function () {
  before(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await Image.drop();
    await ImageAttribute.drop();
    await Layer.drop();
  });

  it("Insert and Get Layers", async () => {
    let layer = await Layer.create({ name: "Bottom" });
    await Image.create({
      name: "Blue",
      filepath: "/opt/Blue.png",
      hash: "xyz23ef",
      layerId: layer.id,
    });
  });

  it("Insert Image", async () => {});
});
