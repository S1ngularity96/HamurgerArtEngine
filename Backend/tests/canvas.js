const { Canvas, Image } = require("canvas");
const mergeImages = require("merge-images");
const path = require("path");
const fs = require('fs')
async function CanvasMergeJpgPng() {
  let sources = [path.join(__dirname, "images/1.jpg"), path.join(__dirname, "images/2.png")];
  let baseImage = await mergeImages(sources, { Canvas: Canvas, Image: Image });
  let base64Data = baseImage.replace(/^data:image\/png;base64,/, "");
  let filepath = path.join(__dirname, "images/merged.png");
  fs.writeFileSync(filepath, base64Data, "base64");
}

CanvasMergeJpgPng();