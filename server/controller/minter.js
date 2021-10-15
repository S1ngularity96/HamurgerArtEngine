const api = require("../helper/api");
const Minter = require("../../Utils/Minter");
const { layersDir } = require("../../config");
const { Layer, ImageGroup } = require("../../models/dbmodels");
const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");

async function mergeLayers(images) {
  let sources = images.map((image) => {
    return `${layersDir}/${image.filepath}`;
  });
  let baseImage = await mergeImages(sources, { Canvas: Canvas, Image: Image });
  return baseImage;
}

async function postInitMinter(req, res) {
  let { all, groups } = req.body;
  if (all === true) {
    let layer = await Layer.find({}).populate({ path: "images" });
    const minter = new Minter();
    minter.initialize(layer);
    let baseImage = await mergeLayers(minter.current);
    api.successResponseWithData(res, "OK", { b64: baseImage, current: minter.current });
    return;
  } else {
    let layer = await Layer.find({});
    groups.forEach(async (group) => {
      let imagegroup = await ImageGroup.findById(group.id).populate({
        path: "images",
        populate: { path: "layer", select: "_id, name, order" },
      });
    });
    api.successResponse(res, "OK");
    return;
  }
  api.successResponse(res, "OK");
}

async function getNext(req, res) {
  try {
    const minter = new Minter();
    minter.next();
    let baseImage = await mergeLayers(minter.current);
    api.successResponseWithData(res, "OK", { b64: baseImage, current: minter.current });
  } catch (err) {
    console.log(err);
    api.ErrorResponse(res, err.toString());
  }
}

module.exports = {
  postInitMinter,
  getNext,
};
