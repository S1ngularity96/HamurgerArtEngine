const router = require("express").Router();
const minterController = require("../controller/minter");

router.post("/init", minterController.postInitMinter, minterController.getMintedImages);
router.get("/stop", minterController.getStopMinter);
router.get("/shuffle", minterController.getShuffle, minterController.getMintedImages);
router.post("/images/:skip", minterController.getMintedImages);
router.get("/next", minterController.getNext);
router.get("/filters", minterController.getFilters);
router.get("/download/minted.zip", minterController.getDownload);
router.get("/metadata/:id", minterController.getMetadataById);
router.get("/metadata", minterController.getMetadataOfImages);
router.get("/statistics", minterController.getStatistics);
module.exports = router;
