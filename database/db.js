const { Sequelize } = require("sequelize");
const config = require("../config");
const path = require("path");

const storage =
  process.env.MODE === "production"
    ? path.join(config.env.PROJECT_DIR, "database.sdb")
    : ":memory:";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storage,
  logging: false,
});

module.exports = sequelize;
