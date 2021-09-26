const router = require("express").Router();
const settingsController = require("../controller/settings");

router.get("/", settingsController.getSettings);
router.post(
  "/",
  settingsController.postSettings,
  settingsController.getSettings,
);

module.exports = router;
