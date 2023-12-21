const express = require("express");
const { createJobApplication, getApplications, getMyAppliedJobs, changeJobStatus } = require("../controller/jobApplicationController");
const { protectPilot } = require("../middlewares/createPilot");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.post("/createApplication", protectPilot, createJobApplication)
router.get("/getMyAppliedJobs", protectPilot, getMyAppliedJobs)
router.post("/getApplications",protectPilot,  getApplications)
router.post("/changeJobStatus", changeJobStatus)
module.exports = router;
