const validate = require("validate.js");

validate.validators.priceIsBetween = function (_, _, _, value) {
  if (value.priceDefault >= value.priceMin && value.priceDefault <= value.priceMax) {
    return null;
  }
  return "is not between range of min and max price";
};

let settingsConstraints = {
  name: {
    presence: true,
    type: "string",
  },
  assetprefix: {
    presence: true,
    type: "string",
  },
  baseURI: {
    presence: true,
    type: "string",
    url: {
      schemes: ["http", "https", "ipfs"],
      allowLocal: true,
    },
  },
  description: {
    presence: true,
    type: "string",
    length: { minimum: 1 },
  },
};

let groupConstraints = {
  name: {
    presence: true,
    type: "string",
  },
  exclusive: {
    presence: true,
    type: "boolean",
  },
  images: {
    type: "array",
  },
};

function flatValidate(object, constraints) {
  return validate(object, constraints, { format: "flat" });
}

module.exports = {
  flatValidate,
  settingsConstraints,
  groupConstraints,
};
