const fs = require("fs");
const path = require("path");

const crypto = require("crypto-js");

function findPngsInDirectory(dir, formatter) {
  fs.readdirSync(dir)
    .filter((file) => file.endsWith(".png"))
    .map((file) => {
      if (formatter) {
        return formatter(file);
      } else {
        return file;
      }
    });
}

function getIndex(layersDir) {
  let layers = fs
    .readdirSync(layersDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  layers.map((name) => {
    let files = findPngsInDirectory(path.join(layersDir, name), (file) => {
      return {
        hash: crypto.MD5(file),
        name: file.replace(".png", ""),
        filepath: file,
      };
    });
    let layer = {
      name: name,
      files: files,
      size: files.length,
    };
    return layer;
  });
}

module.exports = { getIndex };
