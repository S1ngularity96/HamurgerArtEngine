const api = require("../helper/api");
const Minter = require("../../Utils/Minter");
const { layersDir } = require("../../config");
const { Layer, ImageGroup } = require("../../models/dbmodels");
const { GeneratedImage } = require("../../models/dbmodels");
const { generateShuffledSequence } = require("../../Utils/Shuffle");
async function getFilters(req, res) {
  try {
    let layers = await Layer.find({})
      .sort({ order: "asc" })
      .populate({ path: "images", select: "_id, name" });
    api.successResponseWithData(res, "OK", layers);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getMintedImages(req, res) {
  let skip = req.params.skip ? req.params.skip : 0;
  let filters = req.body.filters ? req.body.filters : [];
  try {
    let query = filters.length > 0 ? { images: { $in: filters } } : {};

    let minted = await GeneratedImage.find(query)
      .sort({ order: "asc" })
      .select("_id, filepath")
      .skip(10 * skip)
      .limit(10);
    let totalNumber = await GeneratedImage.find(query).count();
    api.successResponseWithData(res, "OK", { count: totalNumber, items: minted });
  } catch (err) {
    console.log(err);
    api.ErrorResponse(res, err.toString());
  }
}

async function getShuffle(req, res, next) {
  try {
    let minted = await GeneratedImage.find({});
    let totalNumber = minted.length;
    let sequence = generateShuffledSequence(0, totalNumber);
    for (let image = 0; image < totalNumber; image++) {
      await GeneratedImage.findByIdAndUpdate(minted[image]._id, { order: sequence[image] });
    }
    next();
    return;
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function postInitMinter(req, res, next) {
  let { all, groups, limit } = req.body.config;
  limit = limit > 0 ? limit : 10000;
  try {
    await GeneratedImage.deleteMany({});
    if (all === true) {
      let layer = await Layer.find({}).populate({ path: "images" });
      const minter = new Minter();
      minter.initialize(layer);
      await minter.createImages(limit);
      next();
      return;
    }
    api.successResponse(res, "OK");
  } catch (err) {
    console.log(err);
    api.ErrorResponse(res, err.toString());
  }
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
  getFilters,
  getMintedImages,
  getShuffle,
};
