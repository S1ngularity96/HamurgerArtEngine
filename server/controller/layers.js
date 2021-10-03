const api = require("../helper/api");
const { Layer, Image, ImageAttribute, db } = require("../../models/dbmodels");
const { layersDir } = require("../../config");
const { getIndex } = require("../helper/fsHelper");

async function getLayers(req, res) {
  try {
    let layers = await Layer.findAll({ raw: true });
    for (let layer = 0; layer < layers.length; layer++) {
      layers[layer].size = await Image.count({ where: { layerId: layers[layer].id } });
    }
    api.successResponseWithData(res, "OK", layers);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getImages(req, res) {
  try {
    let layerMap = new Map();
    let layers = await Layer.findAll({ raw: true });
    layers.forEach((layer) => {
      layerMap.set(layer.id, layer.name);
    });
    let images = await Image.findAll({ raw: true });
    images = images.map((image) => {
      image.layername = layerMap.get(image.layerId);
      return image;
    });
    api.successResponseWithData(res, "OK", images);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function patchLayers(req, res, next) {
  let layers = req.body.layers;
  try {
    if (layers) {
      for (let layer = 0; layer < layers.length; layer++) {
        await Layer.update(
          { layerorder: layers[layer].layerorder },
          { where: { id: layers[layer].id } }
        );
      }
      next();
      return;
    } else {
      api.BadRequestResponse(res, "Layers missing!");
    }
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getLayersReload(req, res) {
  try {
    let layers = getIndex(layersDir);
    await Image.destroy({ where: {} });
    await Layer.destroy({ where: {} });
    await ImageAttribute.destroy({ where: {} });
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
    let layer = await Layer.findOne({
      where: { name: name },
      include: [{ model: Image, as: "images" }],
    });
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

async function postTraitAttributes(req, res) {
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

async function postExclusionSet(req,res){}

module.exports = {
  getLayer,
  getLayers,
  getImages,
  patchLayers,
  getLayersReload,
  getTraitAttributes,
  postTraitAttributes,
};
