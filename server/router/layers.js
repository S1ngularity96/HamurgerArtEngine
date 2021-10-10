const router = require("express").Router();
const layerController = require("../controller/layers");

router.get("/", layerController.getLayers);
router.patch("/", layerController.patchLayers, layerController.getLayers);
router.get("/groups", layerController.getGroups);
router.post("/group", layerController.postGroup, layerController.getGroups);
router.get("/group/:id", layerController.getGroup);
router.get("/group/:id/imagesavailable", layerController.getGroupImages)
router.patch("/group/:id", layerController.patchGroup, layerController.getGroup);
router.delete("/group/:id", layerController.deleteGroup, layerController.getGroups);
router.get("/images", layerController.getImages);
router.get("/reload", layerController.getLayersReload);
router.get("/:id", layerController.getLayer);
router.get("/:name/:id", layerController.getTraitAttributes);
router.post("/:name/:id", layerController.postTraitAttributes, layerController.getTraitAttributes);

module.exports = router;
