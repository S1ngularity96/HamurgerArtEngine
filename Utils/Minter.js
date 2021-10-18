const LayerIncrementer = require("./Incrementer");
const GraphUtils = require("./GraphUtils");
const { imagesDir, layersDir } = require("../config");
const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");
const { GeneratedImage } = require("../models/dbmodels");
const SocketIO = require("../server/websocket/sock");
const fs = require("fs");

class Minter {
  constructor() {
    if (!Minter.instance) {
      this.current = null;
      this.incrementer = null;
      this.conflictgraph = null;
      this.layers = null;
      this.imagesMap = null;
      this.running = false;
      Minter.instance = this;
    }
    return Minter.instance;
  }

  initialize(layersWithImages) {
    this.layers = layersWithImages.sort((a, b) => {
      return a.order - b.order;
    });
    this.incrementer = new LayerIncrementer();
    this.incrementer.init(this.layers, { backwards: true });
    const images = this.layers.reduce((prev, current) => {
      return prev.concat(current.images);
    }, []);
    this.imagesMap = new Map();
    for (let image = 0; image < images.length; image++) {
      this.imagesMap.set(images[image]._id.toString(), images[image]);
    }

    this.conflictgraph = GraphUtils.CreateConflictGraph(images);
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

  async saveMinted(index, images) {
    let sources = images.map((image) => {
      return `${layersDir}/${image.filepath}`;
    });
    let baseImage = await mergeImages(sources, { Canvas: Canvas, Image: Image });
    let base64Data = baseImage.replace(/^data:image\/png;base64,/, "");
    let filepath = `${imagesDir}/${index}-minted.png`;
    fs.writeFileSync(filepath, base64Data, "base64");
    return { absolute: filepath, relative: `/generated/${index}-minted.png` };
  }

  updateCurrent(number) {
    let images = this.imagesMap;
    let layers = this.layers;
    this.current = number.map((num, index) => {
      return images.get(layers[index].images[num.value]._id.toString());
    });
  }

  /**
   *
   * @param {Number} limit Set the limit for the number of images
   * @param {Number} optImagesCreated Set imagesCreated-value by this parameter
   * @returns
   */
  async createImages(limit, optImagesCreated) {
    let imagesCreated = optImagesCreated ? optImagesCreated : 0;
    let overflow = false;
    let sockio = new SocketIO();
    this.running = true;
    while (imagesCreated != limit && !overflow && this.running) {
      let res = this.next();
      overflow = res.overflow;
      if (res.conflicts === false) {
        this.updateCurrent(res.number);
        let { absolute, relative } = await this.saveMinted(imagesCreated, this.current);
        await GeneratedImage.create({
          order: imagesCreated,
          images: this.current,
          filepath: relative,
        });
        imagesCreated++;
        sockio.emit("/mint/status", { running: true, created: imagesCreated, of: limit });
      }
    }
    sockio.emit("/mint/status", { running: false, created: imagesCreated, of: limit });
    return imagesCreated;
  }

  async stopMinter() {
    this.running = false;
  }

  next() {
    if (this.incrementer !== null) {
      let result = this.current === null ? this.incrementer.reset() : this.incrementer.increment();
      let check = this.checkConflict(result.number);
      return { overflow: result.overflow, conflicts: check.conflicts, number: result.number };
    }
    return null;
  }
}

module.exports = Minter;
