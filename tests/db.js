var assert = require("assert");
const { db, init } = require("../database/db");
const dbmodels = require("../models/dbmodels");

describe("Database", function () {
  before(async () => {
    await init();
  });

  it("Insert and Get Layers", async () => {
    let expected = [{ id: 1, name: "Background", layerorder: null }, {
      id: 2,
      name: "Top",
      layerorder: null,
    }, { id: 3, name: "Bottom", layerorder: null }];

    for(let layer = 0; layer < expected.length; layer++){
        await dbmodels.InsertLayer(expected[layer].name);
    }
    
    try {
      let layers = await dbmodels.GetAllLayers();
      assert.deepStrictEqual(layers, expected)
    } catch (err) {
      assert.fail("Layers should be the same")
    }
  });
});
