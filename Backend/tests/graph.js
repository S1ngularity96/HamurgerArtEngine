const assert = require("assert");
const { Graph } = require("../Utils/Graph");
const { CreateConflictGraph, PairExists, UnmarkAllNodes } = require("../Utils/GraphUtils");

describe("Graph", () => {
  it("Create Conflict Graph", () => {
    testcase = [
      {
        _id: "a",
        name: "a",
        conflicts: [],
      },
      {
        _id: "b",
        name: "b",
        conflicts: [{ _id: "a", name: "a" }],
      },
      {
        _id: "c",
        name: "c",
        conflicts: [{ _id: "a", name: "a" }],
      },
    ];
    let g = CreateConflictGraph(testcase);
    assert.strictEqual(true, g.nodes.has("a"));
    assert.strictEqual(true, g.nodes.has("b"));
    assert.strictEqual(2, g.nodes.get("a").edges.size);
    assert.strictEqual(1, g.nodes.get("b").edges.size);
    assert.strictEqual(1, g.nodes.get("c").edges.size);
  });

  it("Find Pairs in Conflict Graph", () => {
    let images = [
      {
        _id: "a",
        name: "a",
        conflicts: [],
      },
      {
        _id: "b",
        name: "b",
        conflicts: [{ _id: "a", name: "a" }],
      },
      {
        _id: "c",
        name: "c",
        conflicts: [{ _id: "a", name: "a" }],
      },
    ];
    let conflictGraph = CreateConflictGraph(images);

    let testcases = [
      { layers: ["a", "d", "h"], expected: false },
      { layers: ["a", "h", "c"], expected: true },
      { layers: ["a", "b", "c"], expected: true },
      { layers: [], expected: false },
      { layers: ["c", ""], expected: false },
      { layers: ["c", "b", "a"], expected: true },
    ];
    let MustHaveTrue = 3;
    let CurrentHaveTrue = 0;
    testcases.forEach((tc) => {
      for (let layer = 0; layer < tc.layers.length; layer++) {
        if (PairExists(conflictGraph, tc.layers[layer])) {
          assert.strictEqual(true, tc.expected);
          CurrentHaveTrue++;
          break;
        }
      }
      UnmarkAllNodes(conflictGraph);
    });
    assert.strictEqual(MustHaveTrue, CurrentHaveTrue);
  });
});
