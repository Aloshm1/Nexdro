const express = require("express");
const { createSubscription, getMySubscription, getMySubscriptionData, endSubscription } = require("../controller/pilotSubscriptionController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post("/createSubscription", protectPilot, createSubscription)
router.get("/getMySubscription", protectPilot, getMySubscription)
router.get("/getMySubscriptionData", protectPilot, getMySubscriptionData)
router.post("/endSubscription", protect, endSubscription)
module.exports = router;
