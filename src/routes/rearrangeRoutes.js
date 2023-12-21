const express = require("express");
const { createRearrange, getRearrangedMedia, updateRearrangeFiles, getUserRearrange } = require("../controller/rearrangeController");

const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();
router.post("/createRearrange", protectPilot, createRearrange)
router.post("/getRearrangedMedia", protectPilot, getRearrangedMedia)
router.post("/updateRearrangeFiles", protectPilot, updateRearrangeFiles)
router.post("/getUserRearrange/:userName", getUserRearrange)
module.exports = router;
