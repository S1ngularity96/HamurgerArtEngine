const api = require("../helper/api");
const { Layer, Image, ImageGroup } = require("../../models/dbmodels");
const { layersDir } = require("../../config");
const { getIndex } = require("../helper/fsHelper");
const { groupConstraints, flatValidate } = require("../helper/validate");

async function getLayers(req, res) {
  try {
    let layers = await Layer.find({});
    api.successResponseWithData(res, "OK", layers);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getImages(req, res) {
  try {
    let images = await Image.find({}).populate({ path: "layer", select: "_id, name" });
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
        let dbLayer = await Layer.findById(layers[layer].id);
        dbLayer.order = layers[layer].order;
        dbLayer.update();
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

    await Image.deleteMany({});
    await Layer.deleteMany({});
    await ImageGroup.deleteMany({});

    for (let it = 1; it <= layers.length; it++) {
      let layer = layers[it - 1];
      let files = layer.files;
      let nLayer = new Layer({ name: layer.name, order: it });
      for (let file = 0; file < files.length; file++) {
        let nImage = await new Image({
          hash: files[file].hash,
          name: files[file].name,
          filepath: files[file].filepath,
          conflicts: [],
          layer: nLayer._id,
        });
        nLayer.images.push(nImage._id);
        await nImage.save();
      }
      await nLayer.save();
    }
    api.successResponse(res, "Fileindex reloaded successfully");
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getLayer(req, res) {
  let id = req.params.id;
  if (id) {
    let layer = await Layer.findById(id).populate({
      path: "images",
      populate: { path: "layer", select: "_id, name" },
    });
    api.successResponseWithData(res, "OK", layer);
  } else {
    api.BadRequestResponse(res, "No name for layer was given");
  }
}

async function getTraitAttributes(req, res) {
  let id = req.params.id;
  let layer = req.params.name;
  if (id && layer) {
    try {
      let image = await Image.findById(id)
        .populate("conflicts")
        .populate({ path: "layer", select: "_id, name" });
      api.successResponseWithData(res, "OK", image);
    } catch (err) {}
  } else {
    api.BadRequestResponse(res, "ID of layer of file missing");
  }
}

async function postTraitAttributes(req, res, next) {
  let imageId = req.params.id;
  let layer = req.params.name;
  let attributes = req.body;
  if (imageId && layer && attributes) {
    let conflicts = attributes.conflicts.map((conflict) => {
      return conflict._id;
    });
    let update = { conflicts: conflicts };
    await Image.findOneAndUpdate({ _id: imageId }, update);
    next();
  } else {
    api.BadRequestResponse(res, "Layer of identifier of file missing");
  }
}

// everything about groups

async function getGroups(req, res) {
  try {
    let groups = await ImageGroup.find({}).populate("images");
    api.successResponseWithData(res, "OK", groups);
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function getGroup(req, res) {
  try {
    let groupId = req.params.id;
    let group = await ImageGroup.findById(groupId).populate({
      path: "images",
      populate: { path: "layer", select: "_id, name" },
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
    try {
      let images = req.body.images;
      if (images) {
        images = images.map((image) => {
          return image._id;
        });
      }
      let update = { name: req.body.name, exclusive: req.body.exclusive, images: images };
      await ImageGroup.findOneAndUpdate({ _id: req.params.id }, update);
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
    let group = new ImageGroup({ name: req.body.name, exclusive: req.body.exclusive, images: [] });
    await group.save();
    next();
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

async function deleteGroup(req, res, next) {
  let groupid = req.params.id;
  if (groupid) {
    try {
      await ImageGroup.deleteOne({ id: groupid });
      next();
    } catch (err) {
      api.ErrorResponse(res, err.toString());
    }
  } else {
    api.BadRequestResponse(res, "No group id was given");
  }
}

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
