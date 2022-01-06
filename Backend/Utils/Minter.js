const LayerIncrementer = require("./Incrementer");
const GraphUtils = require("./GraphUtils");
const { imagesDir, layersDir } = require("../config");
const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");
const { GeneratedImage } = require("../models/dbmodels");
const SocketIO = require("../server/websocket/sock");
const fs = require("fs");
const { Socket } = require("dgram");

class Minter {
  constructor() {
    if (!Minter.instance) {
      this.groups = [];
      this.running = false;
      Minter.instance = this;
    }
    return Minter.instance;
  }

  initialize(group, layersWithImages) {
    group.layers = layersWithImages.sort((a, b) => {
      return a.order - b.order;
    });
    group.incrementer = new LayerIncrementer();
    group.incrementer.init(group.layers, { backwards: false });
    const images = group.layers.reduce((first, next) => {
      return first.concat(next.images);
    }, []);
    group.imagesMap = new Map();
    for (let image = 0; image < images.length; image++) {
      group.imagesMap.set(images[image]._id.toString(), images[image]);
    }
    group.conflictgraph = GraphUtils.CreateConflictGraph(images);
  }

  addGroup(layersWithImages) {
    let currentLen = this.groups.length;
    this.groups.push({
      index: currentLen,
      layers: null,
      imageIds: null,
      imagesMap: null,
      conflictgraph: null,
      incrementer: null,
      overflow: false,
    });
    this.initialize(this.groups[currentLen], layersWithImages);
  }

  clearGroups() {
    this.groups = [];
  }

  checkConflict(group, number) {
    for (let n = 0; n < number.length; n++) {
      if (group.layers[n].images.length > 0) {
        let result = GraphUtils.PairExists(
          group.conflictgraph,
          group.layers[n].images[number[n].value]._id.toString()
        );
        if (result === true) {
          GraphUtils.UnmarkAllNodes(group.conflictgraph);
          return { conflicts: true, number };
        }
      }
    }
    GraphUtils.UnmarkAllNodes(group.conflictgraph);
    return { conflicts: false, number };
  }

  /**
   * Returns array with associated image ids by the given magic number
   * @param {Object} group Contains data for specific group of layers
   * @param {Number} number Magic number from the incrementer
   */
  getAssociatedImageIds(group, number) {
    let images = group.imagesMap;
    let layers = group.layers;
    return number
      .map((num, index) => {
        if (layers[index].images.length > 0) {
          return images.get(layers[index].images[num.value]._id.toString());
        }
        return null;
      })
      .filter((val) => val !== null); // get only those images which could have been found
  }

  getStatistics() {}

  /**
   * Execute image-generation and save images
   * @param {Number} limit set the limit for the number of images
   * @param {Number} optIndex set atIndex-value by this parameter
   * @param {Number} stepSize set the increment-size
   * @param {Boolean} parallel set if groups should be processed in parallel
   * @returns
   */
  async createImages(limit, stepSize, parallel, optIndex) {
    let atIndex = optIndex ? optIndex : 0;
    let overflow = false;
    let sockio = new SocketIO();
    const groupLen = this.groups.length;
    this.running = true;

    if (parallel && groupLen > 0) {
      let currentGroupIndex = 0;
      let numOfOverflows = 0;
      while (atIndex < limit && numOfOverflows !== groupLen && this.running) {
        let group = this.groups[currentGroupIndex];
        if (!group.overflow) {
          let res = this.next(group, stepSize);
          if (res.overflow) {
            numOfOverflows++;
            group.overflow = true;
            sockio.emit("/mint/overflow", { overflow: true });
          }
          if (res.conflicts === false && !group.overflow) {
            group.imageIds = this.getAssociatedImageIds(group, res.number);
            let { absolute, relative } = await this.saveMinted(atIndex, group.imageIds);
            await GeneratedImage.create({
              order: atIndex,
              images: group.imageIds, //ids
              filepath: relative,
            });
            atIndex++;
            sockio.emit("/mint/status", { running: true, created: atIndex, of: limit });
          }
        }
        currentGroupIndex = (currentGroupIndex + 1) % groupLen; //loop each group
      }
    } else {
      //sequentual process
      for (let groupIndex = 0; groupIndex < groupLen; groupIndex++) {
        let group = this.groups[groupIndex];
        while (atIndex < limit && group.overflow === false && this.running) {
          let res = this.next(group, stepSize);
          group.overflow = res.overflow;
          if (group.overflow) {
            sockio.emit("/mint/overflow", { overflow: true });
            break;
          }
          if (res.conflicts === false) {
            group.imageIds = this.getAssociatedImageIds(group, res.number);
            let { absolute, relative } = await this.saveMinted(atIndex, group.imageIds);
            await GeneratedImage.create({
              order: atIndex,
              images: group.imageIds, //ids
              filepath: relative,
            });
            atIndex++;
            sockio.emit("/mint/status", { running: true, created: atIndex, of: limit });
          }
        }
      }
    }
    sockio.emit("/mint/status", { running: false, created: atIndex, of: limit });
    return atIndex;
  }

  /**
   * Validate if with given parameters image-generation will come to end
   * @param {Number} limit set the limit for the number of images
   * @param {Number} optIndex set atIndex-value by this parameter
   * @param {Number} stepSize set the increment-size
   * @param {Boolean} parallel set if groups should be processed in parallel
   * @returns
   */
  validateCombinations(limit, stepSize, parallel, optIndex) {
    let atIndex = optIndex ? optIndex : 0;
    const groupLen = this.groups.length;
    this.running = true;
    let statistics = {
      overflow: 0,
      conflicts: 0,
    };

    if (parallel && groupLen > 0) {
      let currentGroupIndex = 0;
      let numOfOverflows = 0;
      while (atIndex < limit && numOfOverflows !== groupLen && this.running) {
        let group = this.groups[currentGroupIndex];
        if (!group.overflow) {
          let res = this.next(group, stepSize);
          if (res.overflow) {
            numOfOverflows++;
            group.overflow = true;
            statistics.overflow = statistics.overflow + 1;
          }
          if (res.conflicts === false && !group.overflow) {
            group.imageIds = this.getAssociatedImageIds(group, res.number);
            atIndex++;
          } else {
            statistics.conflicts = statistics.conflicts + 1;
          }
        }
        currentGroupIndex = (currentGroupIndex + 1) % groupLen; //loop each group
      }
    } else {
      //sequentual process
      for (let groupIndex = 0; groupIndex < groupLen; groupIndex++) {
        let group = this.groups[groupIndex];
        while (atIndex < limit && group.overflow === false && this.running) {
          let res = this.next(group, stepSize);
          group.overflow = res.overflow;
          if (group.overflow) {
            statistics.overflow = statistics.overflow + 1;
            break;
          }
          if (res.conflicts === false) {
            group.imageIds = this.getAssociatedImageIds(group, res.number);
            atIndex++;
          } else {
            statistics.conflicts = statistics.conflicts + 1;
          }
        }
      }
    }
    return statistics;
  }

  async stopMinter() {
    this.running = false;
  }

  async saveMinted(index, images) {
    let sources = images.map((image) => {
      return `${layersDir}/${image.filepath}`;
    });
    let baseImage = await mergeImages(sources, { Canvas: Canvas, Image: Image });
    let base64Data = baseImage.replace(/^data:image\/png;base64,/, "");
    let filepath = `${imagesDir}/${index}`;
    fs.writeFileSync(filepath, base64Data, "base64");
    return { absolute: filepath, relative: `/generated/${index}` };
  }

  next(group, stepSize) {
    if (group.incrementer !== null) {
      let result;
      if (group.imageIds === null) {
        result = group.incrementer.reset();
      } else {
        let step = 0;
        for (step; step < stepSize; step++) {
          result = group.incrementer.increment();
        }
      }
      let check = this.checkConflict(group, result.number);
      return { overflow: result.overflow, conflicts: check.conflicts, number: result.number };
    }
    return null;
  }
}

module.exports = Minter;
