const router = require("express").Router();
const minterController = require("../controller/minter");

router.post("/init", minterController.postInitMinter);
router.get("/next", minterController.getNext);
module.exports = router;
