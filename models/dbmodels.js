const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/db");
class Layer extends Model {}
class Image extends Model {}
class ImageAttribute extends Model {}

Layer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    layerorder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "layer",
  }
);

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "image" }
);

ImageAttribute.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rarity: {
      type: DataTypes.REAL,
    },
  },
  { sequelize, modelName: "attributes" }
);

Image.Layer = Image.belongsTo(Layer, {
  as: "layer",
  foreignKey: { allowNull: false, field: "layer" },
});
Layer.Images = Layer.hasMany(Image);

ImageAttribute.Image = ImageAttribute.belongsTo(Image, {
  as: "image",
  foreignKey: { allowNull: false, field: "image" },
});
Image.attributes = Image.hasOne(ImageAttribute);

module.exports = { db: sequelize, Image: Image, ImageAttribute: ImageAttribute, Layer: Layer };
