const router = require("express").Router();
const layerController = require("../controller/layers");


router.get("/", layerController.getIndexIfNotExist, layerController.getLayers);
router.get("/reload", layerController.getLayersReload)
router.get("/:name", layerController.getIndexIfNotExist, layerController.getLayer);
router.get("/:name/:hash", layerController.getIndexIfNotExist, layerController.getTraitAttributes)
router.post("/:name/:hash", layerController.postTraitAttributes);


module.exports = router;
