class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(id, name) {
    if (this.nodes.has(id)) {
      throw new Error(`$Node with ID ${node.id} exists.`);
    } else {
      let node = new Node(id, name);
      this.nodes.set(id, node);
      return node;
    }
  }

  findNodeOrCreate(id, name) {
    if (this.nodes.has(id)) {
      return this.nodes.get(id);
    } else {
      let node = new Node(id, name);
      this.nodes.set(id, node);
      return this.nodes.get(id);
    }
  }

  removeNode(node) {
    return this.nodes.delete(node.id);
  }
}

/**
 *
 */
class Node {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.marked = false;
    this.edges = new Set();
  }

  addEdge(id_v_to) {
    this.edges.add(id_v_to);
  }

  removeEdge(id_v_to) {
    this.edges.delete(id_v_to);
  }
}

module.exports = { Graph, Node };
