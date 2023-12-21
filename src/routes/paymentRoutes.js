const express = require("express");
const { createPayment, getPayments, startPaymentProcess, getInvoice, startCompanyPayment, startAddonPayment, paymentIntends, updateSuccessAddon } = require("../controller/paymentControler");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post("/createPayment", protectPilot, createPayment);
router.get("/getPayments", protectPilot, getPayments)
router.post("/startPaymentProcess", protectPilot, startPaymentProcess)
router.post("/startCompanyPayment", protectPilot, startCompanyPayment)
router.post("/getInvoice", getInvoice)
router.post("/startAddonPayment", protectPilot, startAddonPayment)
router.post("/paymentIntends",protectPilot, paymentIntends)
router.post("/updateSuccessAddon", protectPilot, updateSuccessAddon)
module.exports = router;