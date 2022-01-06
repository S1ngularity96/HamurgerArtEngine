const api = require("../helper/api");
const Minter = require("../../Utils/Minter");
const { imagesDir, env } = require("../../config");
const { Layer, ImageGroup } = require("../../models/dbmodels");
const { GeneratedImage, Image } = require("../../models/dbmodels");
const { generateShuffledSequence } = require("../../Utils/Shuffle");
const { cloneDeep } = require("lodash/lang");
const { createLayersFromGroup } = require("../functions/models");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

const settingsFile = path.join(env.DATABASE_DIR, "settings.json");

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
  let { all, groups, limit, stepSize, parallel, continueMint } = req.body.config;
  let optIndex = 0;
  limit = limit > 0 ? limit : 10000;

  if (continueMint) {
    optIndex = await GeneratedImage.find({}).count();
  } else {
    fs.rmSync(imagesDir, { recursive: true, force: true });
    fs.mkdirSync(imagesDir);
    await GeneratedImage.deleteMany({});
  }

  try {
    if (all === true) {
      let layer = await Layer.find({}).populate({ path: "images" });
      const minter = new Minter();
      minter.clearGroups();
      minter.addGroup(layer);
      await minter.createImages(limit, stepSize, parallel, optIndex);
      next();
      return;
    } else {
      let allgroups = await ImageGroup.find({ _id: groups }).populate({
        path: "images",
        populate: { path: "layer", select: "_id, order" },
      });
      let layer = await Layer.find({});
      const minter = new Minter();
      minter.clearGroups();
      for (let group = 0; group < allgroups.length; group++) {
        //make deep clone to not fetch data from database again
        let tmpLayers = cloneDeep(layer);
        let layerGroup = await createLayersFromGroup(tmpLayers, allgroups[group]);
        minter.addGroup(layerGroup);
      }
      await minter.createImages(limit, stepSize, parallel, optIndex);
      next();
    }
  } catch (err) {
    console.log(err);
    api.ErrorResponse(res, err.toString());
  }
}

async function validateMinterConfig(req, res) {
  let { all, groups, limit, stepSize, parallel, continueMint } = req.body.config;
  let optIndex = 0;
  limit = limit > 0 ? limit : 10000;

  if (continueMint) {
    optIndex = await GeneratedImage.find({}).count();
  }

  try {
    if (all === true) {
      let layer = await Layer.find({}).populate({ path: "images" });
      const minter = new Minter();
      minter.clearGroups();
      minter.addGroup(layer);
      let result = minter.validateCombinations(limit, stepSize, parallel, optIndex);
      console.log(result);
      if (result.overflow > 0) {
        api.BadRequestResponse(res, [
          "Generator overflows!",
          `Found conflicts: ${result.conflicts}`,
        ]);
        return;
      }
      api.successResponse(res, "Configuration validated!");
      return;
    } else {
      let allgroups = await ImageGroup.find({ _id: groups }).populate({
        path: "images",
        populate: { path: "layer", select: "_id, order" },
      });
      let layer = await Layer.find({});
      const minter = new Minter();
      minter.clearGroups();

      for (let group = 0; group < allgroups.length; group++) {
        //make deep clone to not fetch data from database again
        let tmpLayers = cloneDeep(layer);
        let layerGroup = await createLayersFromGroup(tmpLayers, allgroups[group]);
        minter.addGroup(layerGroup);
      }
      let result = minter.validateCombinations(limit, stepSize, parallel, optIndex);
      if (result.overflow > 0) {
        api.BadRequestResponse(res, [
          "Generator overflows!",
          `Found conflicts: ${result.conflicts}`,
        ]);
        return;
      }
      api.successResponse(res, "Configuration validated!");
      return;
    }
  } catch (err) {
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

async function getMetadataOfImages(req, res) {
  if (!fs.existsSync(settingsFile)) {
    api.ErrorResponse(res, "Please add settings for metadata");
    return;
  }

  try {
    let settingsJSON = fs.readFileSync(settingsFile);
    let settings = JSON.parse(settingsJSON);

    let images = await GeneratedImage.find({})
      .sort({ order: "asc" })
      .populate({
        path: "images",
        select: "name",
        populate: { path: "layer", select: "name" },
      });

    images = images.map((image) => {
      return {
        name: `${settings.assetprefix}${image.order}`,
        description: `${settings.description}`,
        tokenId: image.order,
        image: `${settings.baseURI}${image.order}`,
        attributes: image.images.map((attribute) => {
          return {
            trait_type: attribute.layer.name,
            value: attribute.name.replace(".jpg", "").replace(".png", ""),
          };
        }),
      };
    });
    api.successResponseWithData(res, "OK", images);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getMetadataById(req, res) {
  if (!fs.existsSync(settingsFile)) {
    api.ErrorResponse(res, "Please add settings for metadata");
    return;
  }

  let id = req.params.id;
  if (!id) {
    api.BadRequestResponse(res, "No ID was given!");
    return;
  }

  try {
    let settingsJSON = fs.readFileSync(settingsFile);
    let settings = JSON.parse(settingsJSON);

    let image = await GeneratedImage.findById(id).populate({
      path: "images",
      select: "name",
      populate: { path: "layer", select: "name" },
    });

    let metadata = {
      name: `${settings.assetprefix}${image.order}`,
      description: `${settings.description}`,
      tokenId: image.order,
      image: `${settings.baseURI}${image.order}`,
      attributes: image.images.map((attribute) => {
        return {
          trait_type: attribute.layer.name,
          value: attribute.name.replace(".jpg", "").replace(".png", ""),
        };
      }),
    };
    api.successResponseWithData(res, "OK", metadata);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
    return;
  }
}

async function getMetadataFilesReady(req, res, next) {
  if (!fs.existsSync(settingsFile)) {
    api.ErrorResponse(res, "Please add settings for metadata");
    return;
  }

  try {
    let settingsJSON = fs.readFileSync(settingsFile);
    let settings = JSON.parse(settingsJSON);

    let images = await GeneratedImage.find({})
      .sort({ order: "asc" })
      .populate({
        path: "images",
        select: "name",
        populate: { path: "layer", select: "name" },
      });

    images = images.map((image) => {
      return {
        name: `${settings.assetprefix}${image.order}`,
        description: `${settings.description}`,
        tokenId: image.order,
        image: `${settings.baseURI}${image.order}`,
        attributes: image.images.map((attribute) => {
          return {
            trait_type: attribute.layer.name,
            value: attribute.name.replace(".jpg", "").replace(".png", ""),
          };
        }),
      };
    });

    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    let imagesLen = images.length;

    images.forEach((value, index) => {
      fs.writeFileSync(JSON.stringify(value), path.join(imagesDir, `${index}.json`));
    });

    next();
  } catch (err) {
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
    console.log(err);
    api.ErrorResponse(res, "Could not create archive with files");
  }
}

async function getStatistics(req, res) {
  let imageMap = new Map();
  try {
    let generatedImages = await GeneratedImage.find({});
    let totalNumberOfTraits = 0;
    if (generatedImages.length > 0) {
      let images = await Image.find({});
      images.forEach((image) => {
        let copyImage = image.toObject();
        copyImage.present = 0;
        imageMap.set(image._id.toString(), copyImage);
      });
      generatedImages.forEach((gen) => {
        gen.images.forEach((image) => {
          imageMap.get(image.toString()).present++;
          totalNumberOfTraits++;
        });
      });
      imageMap.forEach((value, key) => {
        let rarity = value.present / totalNumberOfTraits;
        value.rarity = `${rarity} %`;
      });

      let stats = Array.from(imageMap.values());
      api.successResponseWithData(res, "OK", stats);
    } else {
      api.ErrorResponse(res, "List of generated images is empty");
    }
  } catch (err) {
    console.log(err);
    api.ErrorResponse(res, err.toString());
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
  getStatistics,
  getMetadataOfImages,
  getMetadataById,
  validateMinterConfig,
};
