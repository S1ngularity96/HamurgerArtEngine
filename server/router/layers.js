const router = require("express").Router();
const layerController = require("../controller/layers");

router.get("/", layerController.getLayers);
router.patch("/", layerController.patchLayers, layerController.getLayers)
router.get("/images", layerController.getImages)
router.get("/reload", layerController.getLayersReload);
router.get("/:name", layerController.getLayer);
router.get("/:name/:hash", layerController.getTraitAttributes);
router.post("/:name/:hash", layerController.postTraitAttributes);

module.exports = router;
