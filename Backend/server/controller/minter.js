const api = require("../helper/api");
const Minter = require("../../Utils/Minter");
const { layersDir, publicDir, imagesDir } = require("../../config");
const { Layer, ImageGroup } = require("../../models/dbmodels");
const { GeneratedImage } = require("../../models/dbmodels");
const { generateShuffledSequence } = require("../../Utils/Shuffle");
const { cloneDeep } = require("lodash/lang");
const { createLayersFromGroup } = require("../functions/models");

const fs = require("fs");
const AdmZip = require("adm-zip");

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

async function getStopMinter(req, res) {
  try {
    const minter = new Minter();
    minter.stopMinter();
    api.successResponse(res, "OK");
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function postInitMinter(req, res, next) {
  let { all, groups, limit } = req.body.config;
  limit = limit > 0 ? limit : 10000;
  try {
    if (all === true) {
      await GeneratedImage.deleteMany({});
      let layer = await Layer.find({}).populate({ path: "images" });
      const minter = new Minter();
      console.log(layer);
      minter.initialize(layer);
      await minter.createImages(limit);
      next();
      return;
    } else {
      await GeneratedImage.deleteMany({});
      let allgroups = await ImageGroup.find({ _id: groups }).populate({
        path: "images",
        populate: { path: "layer", select: "_id, order" },
      });

      let layer = await Layer.find({});
      let layerOfGroups = [];
      for (let group = 0; group < allgroups.length; group++) {
        //make deep clone to not fetch data from database again
        let tmpLayers = cloneDeep(layer);
        let layerGroup = await createLayersFromGroup(tmpLayers, allgroups[group]);
        layerOfGroups.push(layerGroup);
      }

      let imagesCreated = 0;
      const minter = new Minter();
      for (let lgr = 0; lgr < layerOfGroups.length; lgr++) {
        minter.initialize(layerOfGroups[lgr]);
        imagesCreated = await minter.createImages(limit, imagesCreated);
      }
      next();
    }
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

async function getDownload(req, res) {
  const zipFile = `${publicDir}/minted.zip`;
  try {
    const zip = new AdmZip();
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    zip.addLocalFolder(imagesDir);
    zip.writeZip(zipFile);
    api.successDownload(res, zipFile);
  } catch (err) {
    api.ErrorResponse(res, "Could not create archive with files");
  }
}

module.exports = {
  postInitMinter,
  getStopMinter,
  getNext,
  getFilters,
  getMintedImages,
  getShuffle,
  getDownload,
};
