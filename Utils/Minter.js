const LayerIncrementer = require("./Incrementer");
const GraphUtils = require("./GraphUtils");
const { Graph } = require("./Graph");

class Minter {
  constructor() {
    if (!Minter.instance) {
      this.current = null;
      this.incrementer = null;
      this.conflictgraph = null;
      this.layers = null;
      this.imagesMap = null;
      Minter.instance = this;
    }
    return Minter.instance;
  }

  initialize(layersWithImages) {
    this.layers = layersWithImages.sort((a, b) => {
      return a.order - b.order;
    });
    this.incrementer = new LayerIncrementer();
    let result = this.incrementer.init(this.layers, { backwards: true });
    const images = this.layers.reduce((prev, current) => {
      return prev.concat(current.images);
    }, []);
    this.imagesMap = new Map();
    for (let image = 0; image < images.length; image++) {
      this.imagesMap.set(images[image]._id.toString(), images[image]);
    }

    this.conflictgraph = GraphUtils.CreateConflictGraph(images);
    this.updateCurrent(result.number);
    return this.checkConflict(result.number);
  }

  checkConflict(number) {
    for (let n = 0; n < number.length; n++) {
      let result = GraphUtils.PairExists(
        this.conflictgraph,
        this.layers[n].images[number[n].value]._id.toString()
      );
      if (result === true) {
        GraphUtils.UnmarkAllNodes(this.conflictgraph);
        return { conflicts: true, number };
      }
    }
    GraphUtils.UnmarkAllNodes(this.conflictgraph);
    return { conflicts: false, number };
  }

  updateCurrent(number) {
    let images = this.imagesMap;
    let layers = this.layers;
    this.current = number.map((num, index) => {
      return images.get(layers[index].images[num.value]._id.toString());
    });
  }

  next() {
    if (this.incrementer !== null) {
      let result = this.incrementer.increment();
      let check = this.checkConflict(result.number);
      this.updateCurrent(result.number);
      return { overflow: result.overflow, conflict: check.conflicts, number: result.number };
    }
    return null;
  }
}

module.exports = Minter;
