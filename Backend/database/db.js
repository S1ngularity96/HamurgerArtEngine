const mongoose = require("mongoose");

async function connect(options) {
  await mongoose.connect(`mongodb://${options.host}:27017`, {
    user: "root",
    pass: "3ei0kiMxfYnXtWlec6Ok",
    autoCreate: true,
    dbName: "wickedmolly",
  });
}

module.exports = { mongoose, connect };
