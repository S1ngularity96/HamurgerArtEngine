const assert = require("assert");
const LayerIncrementer = require("../Utils/Incrementer");
const fs = require("fs");
const { createLayersFromGroup } = require("../server/functions/models");

describe("Increment", () => {
  it("Forward", () => {
    let testcase = {
      input: {
        layer: [
          { name: "layer 1", images: [1, 1], order: 0 },
          { name: "layer 2", images: [1, 2], order: 1 },
        ],
      },
      expects: [
        {
          overflow: false,
          number: [
            { max_val: 1, value: 0 },
            { max_val: 1, value: 0 },
          ],
        },
        {
          overflow: false,
          number: [
            { max_val: 1, value: 1 },
            { max_val: 1, value: 0 },
          ],
        },
        {
          overflow: false,
          number: [
            { max_val: 1, value: 0 },
            { max_val: 1, value: 1 },
          ],
        },
        {
          overflow: false,
          number: [
            { max_val: 1, value: 1 },
            { max_val: 1, value: 1 },
          ],
        },
        {
          overflow: true,
          number: [
            { max_val: 1, value: 1 },
            { max_val: 1, value: 1 },
          ],
        },
      ],
    };

    let options = { backwards: false };
    let inc = new LayerIncrementer();
    for (let tc = 0; tc < testcase.expects.length; tc++) {
      let expected = testcase.expects[tc];
      if (tc === 0) {
        let result = inc.init(testcase.input.layer, options);
        assert.deepStrictEqual(result, expected);
      } else {
        let result = inc.increment();
        assert.deepStrictEqual(result, testcase.expects[tc]);
      }
    }
  });

  it("Backward", () => {
    let testcase = {
      input: {
        layer: [
          { name: "layer 1", images: [1, 1], order: 0 },
          { name: "layer 2", images: [1, 2], order: 1 },
        ],
      },
      expects: [
        {
          overflow: false,
          number: [
            { max_val: 1, value: 0 },
            { max_val: 1, value: 0 },
          ],
        },
        {
          overflow: false,
          number: [
            { max_val: 1, value: 0 },
            { max_val: 1, value: 1 },
          ],
        },
        {
          overflow: false,
          number: [
            { max_val: 1, value: 1 },
            { max_val: 1, value: 0 },
          ],
        },
        {
          overflow: false,
          number: [
            { max_val: 1, value: 1 },
            { max_val: 1, value: 1 },
          ],
        },
        {
          overflow: true,
          number: [
            { max_val: 1, value: 1 },
            { max_val: 1, value: 1 },
          ],
        },
      ],
    };

    let options = { backwards: true };
    let inc = new LayerIncrementer();
    for (let tc = 0; tc < testcase.expects.length; tc++) {
      let expected = testcase.expects[tc];
      if (tc === 0) {
        let result = inc.init(testcase.input.layer, options);
        assert.deepStrictEqual(result, expected);
      } else {
        let result = inc.increment();
        assert.deepStrictEqual(result, testcase.expects[tc]);
      }
    }
  });
  it("Big Number", () => {
    let testcase = {
      input: {
        layer: [
          { name: "layer 1", images: [1, 2], order: 0 },
          { name: "layer 2", images: [1, 2], order: 1 },
          { name: "layer 3", images: [1, 2, 3, 4, 5, 6, 7, 8], order: 2 },
          { name: "layer 4", images: [1, 2, 3, 4, 5, 6], order: 3 },
          { name: "layer 5", images: [1, 2, 3], order: 4 },
          { name: "layer 6", images: [1, 2, 3, 4], order: 5 },
          { name: "layer 7", images: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], order: 6 },
        ],
      },
      expects: {
        overflow: true,
        number: [
          { max_val: 1, value: 1 },
          { max_val: 1, value: 1 },
          { max_val: 7, value: 7 },
          { max_val: 5, value: 5 },
          { max_val: 2, value: 2 },
          { max_val: 3, value: 3 },
          { max_val: 12, value: 12 },
        ],
      },
    };
    let options = { backwards: true };
    let inc = new LayerIncrementer();
    let expected = testcase.expects;
    let layer = testcase.input.layer;
    inc.init(layer, options);
    let stepsNeeded = 1;
    let result = {};
    do {
      result = inc.increment();
      stepsNeeded++;
    } while (!result.overflow);
    assert.deepStrictEqual(result, expected);
  });
});

describe("Groups", () => {
  it("Generate Layers from Groups", () => {
    let layer = [
      { _id: "616c7f884e679595c8b1b18c", name: "Background", order: 1 },
      { _id: "616c7f884e679595c8b1b180", name: "Accessory", order: 2 },
      { _id: "616c7f884e679595c8b1b19a", name: "Base", order: 3 },
      { _id: "616c7f884e679595c8b1b19bc", name: "Custom", order: 4 },
    ];
    let groups = {
      _id: "616caa12fdcc09a073ed2bcc",
      name: "Teal Background",
      exclusive: false,
      images: [
        {
          _id: "616c7f884e679595c8b1b197",
          hash: "0a61701928efa373d417adaf7f697c0b",
          name: "Basic Teal.png",
          filepath: "Background/Basic Teal.png",
          conflicts: [],
          layer: {
            _id: "616c7f884e679595c8b1b18c",
            name: "Background",
          },
        },
        {
          _id: "616c7f884e679595c8b1b185",
          hash: "cdab2049346cb64256e2b64a454d47fc",
          name: "Cyber.png",
          filepath: "Accessory/Cyber.png",
          conflicts: [],
          layer: {
            _id: "616c7f884e679595c8b1b180",
            name: "Accessory",
          },
        },
        {
          _id: "616c7f884e679595c8b1b19b",
          hash: "854d1b0477393b5b9e4deca143863b25",
          name: "Base.png",
          filepath: "Base/Base.png",
          conflicts: [],
          layer: {
            _id: "616c7f884e679595c8b1b19a",
            name: "Base",
          },
        },
      ],
    };

    // Since the group does not have images associated with the layer Custom
    // we expect that the layer wont appear in the array
    expectedLayers = [
      {
        _id: "616c7f884e679595c8b1b18c",
        name: "Background",
        order: 1,
        images: [
          {
            _id: "616c7f884e679595c8b1b197",
            hash: "0a61701928efa373d417adaf7f697c0b",
            name: "Basic Teal.png",
            filepath: "Background/Basic Teal.png",
            conflicts: [],
            layer: {
              _id: "616c7f884e679595c8b1b18c",
              name: "Background",
            },
          },
        ],
      },
      {
        _id: "616c7f884e679595c8b1b180",
        name: "Accessory",
        order: 2,
        images: [
          {
            _id: "616c7f884e679595c8b1b185",
            hash: "cdab2049346cb64256e2b64a454d47fc",
            name: "Cyber.png",
            filepath: "Accessory/Cyber.png",
            conflicts: [],
            layer: {
              _id: "616c7f884e679595c8b1b180",
              name: "Accessory",
            },
          },
        ],
      },
      {
        _id: "616c7f884e679595c8b1b19a",
        name: "Base",
        order: 3,
        images: [
          {
            _id: "616c7f884e679595c8b1b19b",
            hash: "854d1b0477393b5b9e4deca143863b25",
            name: "Base.png",
            filepath: "Base/Base.png",
            conflicts: [],
            layer: {
              _id: "616c7f884e679595c8b1b19a",
              name: "Base",
            },
          },
        ],
      },
    ];
    let generatedLayer = createLayersFromGroup(layer, groups);
    assert.deepStrictEqual(generatedLayer, expectedLayers);
  });
});
