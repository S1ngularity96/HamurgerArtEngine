/*
    [{max_val:3, value: 0}, {max_val:10, value: 7}, {max_val:22, value: 8}]
*/

class LayerIncrementer {
  /**
   * @summary Take layers object e.g [{name: "Layer 1", images: []}, ...] an creates
   * a Incrementer for Combinations
   *
   */
  constructor() {
    this.options = { backwards: false };
    this.magicNumber = [];
    this.size = 0;
  }

  /**
   * @summary Initialize incrementer with layers and options
   * @param {Array} layers
   * @param {Object} options Define options for LayerIncrementer
   * @param {Boolean} options.backwards Increment backwards
   * @returns {Array} magicNumber
   */
  init(layers, options) {
    this.options = options;
    let tmpLayers = layers.sort((a, b) => {
      if (a.order === 0 && b.order === 0) throw Error("Order is not strict");
      return a.order - b.order;
    });
    this.size = tmpLayers.length;
    for (let layer = 0; layer < tmpLayers.length; layer++) {
      this.magicNumber.push({ max_val: tmpLayers[layer].images.length - 1, value: 0 });
    }
    return { overflow: false, number: [...this.magicNumber] };
  }

  rollover(atIndex, minMaxIndex, options) {
    let rolloveragain = false;
    switch (this.options.backwards) {
      case true:
        for (let index = atIndex; index >= minMaxIndex; index--) {
          if (index == minMaxIndex) {
            if (this.magicNumber[index].value < this.magicNumber[index].max_val) {
              this.magicNumber[index].value++;
              return { overflow: false, clearTo: index + 1 };
            } else {
              return { overflow: true };
            }
          } else if (this.magicNumber[index].value < this.magicNumber[index].max_val) {
            this.magicNumber[index].value++;
            return { overflow: false, clearTo: index + 1 };
          }
        }
        return;
      case false:
        for (let index = atIndex; index <= minMaxIndex; index++) {
          if (index == minMaxIndex) {
            if (this.magicNumber[index].value < this.magicNumber[index].max_val) {
              this.magicNumber[index].value++;
              return { overflow: false, clearTo: index - 1 };
            } else {
              return { overflow: true };
            }
          } else if (this.magicNumber[index].value < this.magicNumber[index].max_val) {
            this.magicNumber[index].value++;
            return { overflow: false, clearTo: index - 1 };
          }
        }
    }
  }
  increment() {
    let backwards = this.options.backwards;
    let minMaxIndex = backwards ? 0 : this.size - 1;
    let atIndex = backwards ? this.size - 1 : 0;

    if (this.magicNumber[atIndex].value === this.magicNumber[atIndex].max_val) {
      let newIndex = backwards ? atIndex - 1 : atIndex + 1;
      let result = this.rollover(newIndex, minMaxIndex, this.options);
      if (!result.overflow) this.setToZero(result.clearTo, backwards);
      return { overflow: result.overflow, number: [...this.magicNumber] };
    } else {
      this.magicNumber[atIndex].value++;
      return { overflow: false, number: [...this.magicNumber] };
    }
  }

  setToZero(toIndex, backwards) {
    if (backwards) {
      let startAt = this.magicNumber.length - 1;
      for (let n = startAt; n >= toIndex; n--) {
        this.magicNumber[n].value = 0;
      }
    } else {
      for (let n = 0; n <= toIndex; n++) {
        this.magicNumber[n].value = 0;
      }
    }
  }

  reset() {
    this.magicNumber.forEach((number) => {
      number.value = 0;
      return number;
    });
  }
}

module.exports = LayerIncrementer;
