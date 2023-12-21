const express = require("express");
const { createEnquiry, getEnquiries, changeEnquiryStatus } = require("../controller/enquiryController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();
// router.post("/likeComment",protectPilot, likeComment);
router.post("/createEnquiry/:id", protectPilot, createEnquiry)
router.get("/getEnquiries", protectPilot, getEnquiries)
router.post("/changeEnquiryStatus", changeEnquiryStatus)

module.exports = router;
