const { db } = require("../database/db");

function InsertLayer(name) {
  return new Promise((resolve, reject) => {
    let stmt = db.prepare(`INSERT INTO Layer (name) VALUES (?)`);
    stmt.run([name], (result, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    stmt.finalize();
  });
}

function GetAllLayers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, name, layerorder FROM Layer", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function GetLayerById(id) {
}

function InsertImage() {
}

function GetImageAttributesById() {
}

function GetImageById() {
}

module.exports = {
  InsertLayer,
  GetAllLayers,
};
