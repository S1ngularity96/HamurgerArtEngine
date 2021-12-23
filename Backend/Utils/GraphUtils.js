const { Graph, Node } = require("./Graph");

/**
 *
 * @param {Graph} g
 */
function PairExists(g, nodeid) {
  if (g.nodes.has(nodeid)) {
    let node = g.nodes.get(nodeid);
    if (node.marked) return true;
    node.marked = true;
    node.edges.forEach((value) => {
      if (g.nodes.has(value)) {
        let target_node = g.nodes.get(value);
        if (target_node.marked) return true;
        else target_node.marked = true;
      }
    });
  }
  return false;
}

/**
 * @param {Array} images Creates a conflict graph from an array of images.
 * These images are especially created by molly-preview.
 */
function CreateConflictGraph(images) {
  let g = new Graph();
  images.forEach(function (image) {
    let node = g.addNode(image._id.toString(), image.name);
    if (image.conflicts) {
      image.conflicts.forEach(function (conflict) {
        node.addEdge(conflict._id.toString());
        let target = g.findNodeOrCreate(conflict._id.toString(), conflict.name);
        target.addEdge(node.id);
      });
    }
  });
  return g;
}
/**
 * @param {Graph} g
 */
function UnmarkAllNodes(g) {
  g.nodes.forEach((value, _) => {
    value.marked = false;
  });
}

module.exports = { UnmarkAllNodes, CreateConflictGraph, PairExists };
