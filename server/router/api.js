let router = require('express').Router();
let layersRouter = require('./layers')
let settingsRouter = require('./settings')
router.use("/layers", layersRouter)
router.use("/settings", settingsRouter);
module.exports = router;