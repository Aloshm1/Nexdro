const express = require("express");
const { createCompanySubscription, getSubscriptionCompany, cancelSubscription } = require("../controller/companySubscriptionController");

const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();
router.post(`/createCompanySubscription`, protectPilot, createCompanySubscription)
router.post(`/getSubscriptionCompany`, protect, getSubscriptionCompany)
router.post("/cancelSubscription", protect, cancelSubscription)
module.exports = router;
