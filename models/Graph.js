class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(node) {
    if (this.nodes.has(node.id)) {
      throw new Error(`$Node with ID ${node.id} exists.`);
    } else {
      this.nodes.set(node.id, node);
    }
  }

  removeNode(node) {
    return this.nodes.delete(node.id);
  }
}

class Node {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.edges = [];
  }

  addEdge(id_v_to) {
    this.edges.push(new Edge(this.id, v_to));
  }

  removeEdge(id_v_to) {
    this.edges.filter((edge) => {
      return edge.v_to === id_v_to ? false : true;
    });
  }
}

class Edge {
  constructor(V_FROM, V_TO) {
    this.v_from = V_FROM;
    this.v_to = V_TO;
  }
}
