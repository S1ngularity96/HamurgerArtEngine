const fs = require("fs");
const path = require("path");
const api = require("../helper/api");
const { layersDir } = require("../../config");
const crypto = require("crypto-js");
const index = new Map();

function getIndex() {
  index.clear();
  const findPngsInDirectory = (dir) =>
    fs.readdirSync(dir).filter((file) => file.endsWith(".png")).map((file) => {
      return {
        filename: file,
        name: file.replace(".png", ""),
        hash: crypto.MD5(file).toString(),
      };
    });

  let layers = fs.readdirSync(layersDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  layers.map((name) => {
    let layer = {
      name: name,
      files: findPngsInDirectory(path.join(layersDir, name)),
      size: findPngsInDirectory(path.join(layersDir, name)).length,
    };

    layer.files.forEach((file) => {
      let hashFile = path.join(layersDir, layer.name, file.hash + ".json");
      if (true) {
        console.log("Creating attributesfile: "+hashFile);
        fs.writeFileSync(hashFile, JSON.stringify({attributes:[file.name]}))
      }
    });
    return layer;
  }).forEach((layer) => {
    index.set(layer.name, layer);
  });
}

function getIndexIfNotExist(req, res, next) {
  if (index.size === 0) {
    try {
      getIndex();
    } catch (err) {
      api.ErrorResponse(res, err.toString());
      return;
    }
  }
  next();
}

function getLayers(req, res) {
  let layers = [];
  index.forEach((layer) => {
    layers.push({ name: layer.name, size: layer.size });
  });
  api.successResponseWithData(res, "OK", layers);
}

function getLayersReload(req, res, next) {
  try {
    getIndex();
    api.successResponse(res, "Reloaded successfully");
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

function getLayer(req, res) {
  let name = req.params.name;
  if (name) {
    if (index.has(name)) {
      let layer = index.get(name);
      api.successResponseWithData(res, "OK", layer);
    } else {
      api.BadRequestResponse(res, "No layer with name " + name + " exists");
    }
  } else {
    api.BadRequestResponse(res, "No name for layer was given");
  }
}

function getTraitAttributes(req,res){
  let hash = req.params.hash;
  let layer = req.params.name;
  if(hash && layer){
    let hashFile = path.join(layersDir, layer, hash+".json")
    if(fs.existsSync(hashFile)){
      let attributes = fs.readFileSync(hashFile).toString();
      attributes = JSON.parse(attributes);
      api.successResponseWithData(res, "OK", attributes);
    }else{
      api.BadRequestResponse(res, "Traitattributes could not be found")
    }
  }else{
    api.BadRequestResponse(res, "Layer of identifier of file missing")
  }
}

function postTraitAttributes(req,res){
  let hash = req.params.hash;
  let layer = req.params.name;
  let attributes = req.body.attributes;
  if(hash && layer){
    let hashFile = path.join(layersDir, layer, hash+".json")
    if(fs.existsSync(hashFile)){
      fs.writeFileSync(hashFile, JSON.stringify(attributes));
      api.successResponse(res, "OK");
    }else{
      api.BadRequestResponse(res, "Traitattributes could not be found")
    }
  }else{
    api.BadRequestResponse(res, "Layer of identifier of file missing")
  }
}

module.exports = {
  getLayer,
  getLayers,
  getLayersReload,
  getIndexIfNotExist,
  getTraitAttributes,
  postTraitAttributes
};
