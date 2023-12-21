const express = require("express");
const { createSubscription, getSubscriptions, getSubscription, getCardDetails } = require("../controller/subscriptionController");

const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post(`/createSubscription`, createSubscription)
router.get("/getSubscriptions", getSubscriptions)
router.post("/getSubscription", getSubscription)
router.post("/getCardDetails", getCardDetails)
module.exports = router;
