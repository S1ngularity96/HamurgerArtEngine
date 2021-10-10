const assert = require("assert");
const LayerIncrementer = require("../Utils/Incrementer");
const fs = require("fs");
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
          { name: "layer 1", images: [1, 1], order: 0 },
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
