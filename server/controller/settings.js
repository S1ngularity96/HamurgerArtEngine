const path = require("path");
const fs = require("fs");
const { env } = require("../../config");
const api = require("../helper/api");
const settingsFile = path.join(env.DATABASE_DIR, "settings.json");
const { flatValidate, settingsConstraints } = require("../helper/validate");
function getSettings(req, res) {
  if (!fs.existsSync(settingsFile)) {
    let defaultSettings = {
      name: "",
      startAt: 0,
      priceDefault: 0,
      priceMin: 0,
      priceMax: 0,
      imageHeigth: 0,
      imageWidth: 0,
      thumbnailHeigth: 0,
      thumbnailWidth: 0,
    };

    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings));
    api.successResponseWithData(res, "OK", defaultSettings);
  } else {
    let settingsText = fs.readFileSync(settingsFile);
    api.successResponseWithData(res, "OK", JSON.parse(settingsText));
  }
}

function postSettings(req, res, next) {
  let settings = req.body;
  let validation = flatValidate(settings, settingsConstraints);
  if (validation) {
    api.BadRequestResponse(res, validation);
    return;
  }
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(settings));
    next();
    return;
  } catch (err) {
    api.ErrorResponse(res, err.toString());
  }
}

module.exports = {
  getSettings,
  postSettings,
};
