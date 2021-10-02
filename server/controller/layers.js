const api = require("../helper/api");
const { Layer, Image, ImageAttribute } = require("../../models/dbmodels");
const { layersDir } = require("../../config");
const { createIndex } = require("../helper/fsHelper");

async function getLayers(req, res) {
  try {
    let layers = await Layer.findAll({ raw: true });
    api.successResponseWithData(res, "OK", layers);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getLayersReload(req, res) {
  try {
    let layers = createIndex(layersDir);
    await Image.drop();
    await Layer.drop();
    await ImageAttribute.drop();
    layers.forEach(async (layer) => {
      let createdLayer = await Layer.create({ name: layer.name });
      layer.files.forEach(async (file) => {
        await Image.create({
          name: file.name,
          filepath: file.filepath,
          hash: file.hash,
          layerId: createdLayer.id,
        });
      });
    });
    api.successResponse(res, "Fileindex reloaded successfully");
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getLayer(req, res) {
  let name = req.params.name;
  if (name) {
    let layer = await Layer.findOne({ where: { name: name }, include: [Image], raw: true });
    api.successResponseWithData(res, "OK", layer);
  } else {
    api.BadRequestResponse(res, "No name for layer was given");
  }
}

async function getTraitAttributes(req, res) {
  let hash = req.params.hash;
  let layer = req.params.name;
  if (hash && layer) {
    try {
      let image = await Image.findOne({ where: { hash: hash }, raw: true });
      let attributes = await ImageAttribute.findOne({ where: { imageId: image.id }, raw: true });
      image.attributes = attributes;
      api.successResponseWithData(res, "OK", image);
    } catch (err) {}
  } else {
    api.BadRequestResponse(res, "Layer of identifier of file missing");
  }
}

function postTraitAttributes(req, res) {
  let hash = req.params.hash;
  let layer = req.params.name;
  if (hash && layer) {
    let image = await Image.findOne({ where: { hash: hash }, raw: true });
    let attributes = await ImageAttribute.findOne({ where: { imageId: image.id } });
    attributes.update(req.body.attributes);
    api.successResponse(res, "OK");
  } else {
    api.BadRequestResponse(res, "Layer of identifier of file missing");
  }
}

module.exports = {
  getLayer,
  getLayers,
  getLayersReload,
  getIndexIfNotExist,
  getTraitAttributes,
  postTraitAttributes,
};
