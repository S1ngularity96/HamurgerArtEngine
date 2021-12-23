const config = require("../config");
const path = require("path");

const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect("mongodb://localhost:27017", {
    user: "root",
    pass: "3ei0kiMxfYnXtWlec6Ok",
    autoCreate: true,
    dbName: "wickedmolly"
  });
}

module.exports = { mongoose, connect };
