const router = require("express").Router();
const minterController = require("../controller/minter");

router.post("/init", minterController.postInitMinter, minterController.getMintedImages);
router.get("/stop", minterController.getStopMinter);
router.get("/shuffle", minterController.getShuffle, minterController.getMintedImages);
router.post("/images/:skip", minterController.getMintedImages);
router.get("/next", minterController.getNext);
router.get("/filters", minterController.getFilters);
router.get("/download/minted.zip", minterController.getDownload)
module.exports = router;
