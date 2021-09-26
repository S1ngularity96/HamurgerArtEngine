const validate = require("validate.js");

validate.validators.priceIsBetween = function (_,_,_, value) {
  if (
    value.priceDefault >= value.priceMin && value.priceDefault <= value.priceMax
  ) {
    return null;
  }
  return "is not between range of min and max price";
};

let settingsConstraints = {
  name: {
    presence: true,
    type: "string",
  },
  startAt: {
    presence: true,
    type: "integer",
    numericality: {
      greaterThan: -1,
    },
  },
  priceDefault: {
    type: "number",
    presence: true,
    priceIsBetween: true,
  },
  priceMin: {
    type: "number",
    presence: true,
    numericality: {
      greaterThan: -1,
    },
  },
  priceMax: {
    type: "number",
    presence: true,
    numericality: {
      greaterThan: -1,
    },
  },
};

function flatValidate(object, constraints){
    return validate(object, constraints, {format: "flat"});
}

module.exports = {
    flatValidate,
    settingsConstraints
}