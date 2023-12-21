const express = require("express");
const { createDraft, getMyDrafts, deleteDraft, submitDraft, getDetails } = require("../controller/draftJobController");
const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();

router.post("/createDraft", protectPilot, createDraft)
router.post("/getMyDrafts", protect, getMyDrafts)
router.post("/deleteDraft", deleteDraft)
router.post("/submitDraft",protectPilot, submitDraft)
router.post("/getDetails", getDetails)
module.exports = router;