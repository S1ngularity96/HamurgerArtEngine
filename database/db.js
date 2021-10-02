const sqlite3 = require("sqlite3");
var db = new sqlite3.Database(":memory:");

let layers = `CREATE TABLE IF NOT EXISTS Layer(
    id integer PRIMARY KEY AUTOINCREMENT,
    layerorder integer,
    name text NOT NULL
  );`;

let images = `CREATE TABLE IF NOT EXISTS Image(
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  filepath text NOT NULL,
  hash text NOT NULL,
  layer integer not null,
  foreign key (layer) references Layer (id),
  UNIQUE(hash)
);`;

let imageattributes = `CREATE TABLE IF NOT EXISTS ImageAttribute(
    rarity REAL,
    image integer not null,
    foreign key(image) references Image(id) ON DELETE CASCADE
);`;

function init() {
  let promise = new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`${layers} ${images} ${imageattributes}`, (result, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  return promise;
}

module.exports = { db, init };
