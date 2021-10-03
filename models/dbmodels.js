const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/db");
class Project extends Model {}
class Layer extends Model {}
class Image extends Model {}
class ImageAttribute extends Model {}
class Group extends Model {}
class ImageGroup extends Model {}
class ExclusionGroup extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "project",
  }
);

ExclusionGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "exclusiongroup",
  }
);

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    exclusive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "imagegroup",
  }
);

ImageGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "imagegroup",
  }
);

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

ExclusionGroup.imgsource = ExclusionGroup.belongsTo(Image, {
  as: "imgsource",
  foreignKey: { allowNull: false, field: "imgdest" },
  onDelete: "CASCADE",
});

ExclusionGroup.imgdest = ExclusionGroup.belongsTo(Image, {
  as: "imgdest",
  foreignKey: { allowNull: false, field: "imgdest" },
  onDelete: "CASCADE",
});

ImageGroup.image = ImageGroup.belongsTo(Image, {
  as: "image",
  foreignKey: { allowNull: false, field: "image" },
  onDelete: "CASCADE",
});

ImageGroup.group = ImageGroup.belongsTo(Group, {
  as: "group",
  foreignKey: { allowNull: false, field: "group" },
  onDelete: "CASCADE",
});

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
