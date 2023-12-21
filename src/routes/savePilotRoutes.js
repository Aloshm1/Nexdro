const express = require("express");
const { savePilot, getSavedPilots, getMySavedPilots, unSavePilot } = require("../controller/savePilotController");
const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
router.post("/savePilot", protectPilot, savePilot)
router.post("/getsavedPilots", getSavedPilots)
router.post("/getMysavedPilots", protect, getMySavedPilots)
router.post("/unsavePilot", protectPilot, unSavePilot)

module.exports = router;