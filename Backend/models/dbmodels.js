const { mongoose } = require("../database/db");

const Types = mongoose.Schema.Types;
const Schema = mongoose.Schema;
const model = mongoose.model;

const Project = new Schema({
  name: { type: Types.String, required: true },
  active: { type: Types.Boolean, required: true },
});

const Image = new Schema({
  hash: { type: Types.String, unique: true, required: true },
  name: { type: Types.String, required: true, unique: false },
  filepath: { type: Types.String, unique: true, required: true },
  conflicts: [{ type: Types.ObjectId, ref: "image" }],
  layer: { type: Types.ObjectId, ref: "layer", required: true },
});

const ImageGroup = new Schema({
  name: { type: Types.String, required: true },
  exclusive: { type: Types.Boolean, default: false },
  images: [{ type: Types.ObjectId, ref: "image" }],
});

const Layer = new Schema({
  name: { type: Types.String, required: true },
  order: { type: Types.Number },
  images: [{ type: Types.ObjectId, ref: "image" }],
});

const GeneratedImage = new Schema({
  order: { type: Types.Number, required: true },
  images: [{ type: Types.ObjectId, ref: "image" }],
  filepath: { type: Types.String, required: true },
});

const ProjectModel = model("project", Project);
const LayerModel = model("layer", Layer);
const ImageGroupModel = model("imagegroup", ImageGroup);
const ImageModel = model("image", Image);
const GeneratedImageModel = model("generated", GeneratedImage);

Image.pre("remove", async function (done) {
  done();
});

module.exports = {
  Project: ProjectModel,
  Layer: LayerModel,
  ImageGroup: ImageGroupModel,
  Image: ImageModel,
  GeneratedImage: GeneratedImageModel,
};
