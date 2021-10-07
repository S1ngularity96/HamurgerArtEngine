const router = require("express").Router();
const { layersOrder } = require("../../config");
const layerController = require("../controller/layers");
const { route } = require("./settings");

router.get("/", layerController.getLayers);
router.patch("/", layerController.patchLayers, layerController.getLayers);
router.get("/groups", layerController.getGroups);
router.post("/group", layerController.postGroup, layerController.getGroups);
router.get("/group/:id", layerController.getGroup);
router.patch("/group/:id", layerController.patchGroup, layerController.getGroup)
router.delete("/group/:id", layerController.deleteGroup, layerController.getGroups);
router.get("/images", layerController.getImages);
router.get("/reload", layerController.getLayersReload);
router.get("/:id", layerController.getLayer);
router.get("/:name/:hash", layerController.getTraitAttributes);
router.post("/:name/:hash", layerController.postTraitAttributes);

module.exports = router;
