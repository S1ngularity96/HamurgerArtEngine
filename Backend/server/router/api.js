let router = require("express").Router();
let layersRouter = require("./layers");
let settingsRouter = require("./settings");
let minterRouter = require("./minter");

router.use("/layers", layersRouter);
router.use("/settings", settingsRouter);
router.use("/minter", minterRouter);
module.exports = router;
