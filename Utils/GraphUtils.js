const { Graph, Node, Edge } = require("./Graph");

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
      if (g.nodes.has(value) && value !== node.id) {
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
  images.forEach((image) => {
    let node = new Node(image._id, image._name);
    g.nodes.set(images._id, node);
    if (image.conflicts) {
      image.conflicts.forEach((conflict) => {
        node.addEdge(conflict._id);
        let target = g.findNodeOrCreate(conflict._id, conflict.name);
        target.addEdge(node._id);
      });
    }
  });
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
