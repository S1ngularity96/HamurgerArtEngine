const fs = require("fs");
const path = require("path");
const crypto = require("crypto-js");

function findPngsInDirectory(dir, formatter) {
  return fs
    .readdirSync(dir)
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

  return layers.map((name) => {
    let files = findPngsInDirectory(path.join(layersDir, name), (file) => {
      return {
        hash: crypto.MD5(`${name}-${file}`).toString(),
        name: file,
        filepath: path.join(name, file),
      };
    });

    return { name: name, files: files, size: files.length };
  });
}

module.exports = { getIndex };
