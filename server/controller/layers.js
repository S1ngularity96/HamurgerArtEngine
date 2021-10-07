const api = require("../helper/api");
const { Layer, Image, ImageAttribute, ImageGroup, Group } = require("../../models/dbmodels");
const { layersDir } = require("../../config");
const { getIndex } = require("../helper/fsHelper");
const { groupConstraints, flatValidate } = require("../helper/validate");

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
    let images = await Image.findAll({
      include: { model: Layer, as: "layer", attributes: ["name"] },
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
  let id = req.params.id;
  if (id) {
    let layer = await Layer.findOne({
      where: { id: id },
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

async function getGroups(req, res) {
  try {
    let groups = await Group.findAll({
      include: {
        model: Image,
        through: ImageGroup,
        as: "images",
        include: { model: Layer, attributes: ["name"], as: "layer" },
      },
    });
    api.successResponseWithData(res, "OK", groups);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getGroup(req, res) {
  try {
    let groupId = req.params.id;
    let group = await Group.findOne({
      where: { id: groupId },
      include: {
        model: Image,
        through: ImageGroup,
        include: { model: Layer, as: "layer", attributes: ["name"] },
      },
    });
    api.successResponseWithData(res, "OK", group);
  } catch (err) {
    api.BadRequestResponse(res, err.toString());
  }
}

async function patchGroup(req, res, next) {
  let groupId = req.params.id;
  let validate = flatValidate(req.body, groupConstraints);
  if (validate) {
    api.BadRequestResponse(res, validate);
  }

  if (groupId) {
    let images = req.body.images;
    try {
      await ImageGroup.destroy({ where: { groupId: groupId } });
      for (let image = 0; image < images.length; image++) {
        await ImageGroup.create({ imageId: images[image].id, groupId: groupId });
      }
      await Group.update(
        { name: req.body.name, exclusive: req.body.exclusive },
        { where: { id: groupId } }
      );
      next();
    } catch (err) {
      api.ErrorResponse(res, err.toString());
    }
  } else {
    api.BadRequestResponse(res, "No group id was given");
  }
}

async function postGroup(req, res, next) {
  let validation = flatValidate(req.body, groupConstraints);
  if (validation) {
    api.BadRequestResponse(res, validation);
    return;
  }
  try {
    await Group.create({ name: req.body.name, exclusive: req.body.exclusive });
    next();
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function deleteGroup(req, res, next) {
  let groupid = req.params.id;

  if (groupid) {
    try {
      await Group.destroy({ where: { id: groupid } });
      next();
    } catch (err) {
      api.ErrorResponse(res, err.toString());
    }
  } else {
    api.BadRequestResponse(res, "No group id was given");
  }
}

async function postExclusionSet(req, res) {}

module.exports = {
  getLayer,
  getLayers,
  getImages,
  patchLayers,
  getLayersReload,
  getTraitAttributes,
  postTraitAttributes,
  getGroup,
  getGroups,
  postGroup,
  deleteGroup,
  patchGroup,
};
