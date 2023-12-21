const express = require("express");
const { createFaq, getFaqs, searchFaqs } = require("../controller/faqController");

const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post("/createFaq", createFaq)
router.get("/getFaqs", getFaqs)
router.post("/searchFaqs", searchFaqs)
module.exports = router;