const path = require("path");
const env = {
  PROJECT_DIR: __dirname,
  DATABASE_DIR: path.join(__dirname, "database"),
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
const publicDir = path.join(env.PROJECT_DIR, "server", "public");
const imagesDir = path.join(env.PROJECT_DIR, "server", "public", "generated");
const format = {
  width: 2000,
  height: 2000,
};

module.exports = {
  env,
  layersOrder,
  format,
  buildDir,
  layersDir,
  imagesDir,
  publicDir,
};
