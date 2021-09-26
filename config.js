const path = require('path')
const env = {
  PROJECT_DIR: __dirname,
  SERVER_PORT: 8000,
};

const layersOrder = [
  { name: "Background" },
  { name: "Body" },
  { name: "Boots" },
  { name: "Base" },
  { name: "Bottom" },
  { name: "Top" },
  { name: "Head" },
  { name: "Accessory" },
];

const buildDir = path.join(env.PROJECT_DIR, "build");
const layersDir = path.join(env.PROJECT_DIR, "Layers");

const format = {
  width: 2000,
  height: 2000,
};

const rarity = [];

const defaultEdition = 5;

module.exports = {
  env,
  layersOrder,
  format,
  rarity,
  defaultEdition,
  buildDir,
  layersDir,
};
