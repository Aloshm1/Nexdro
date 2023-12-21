const express = require("express");
const { sendData, getJobs, jobLanding, getFilterJobs, applyJob, likeJob, unlikeJob, getApprovedJobs, getPendingJobs, deleteJob, editJob, getApplications, expireJob, getExpiredJobs, filterJobs, getJobByName, getIdBySlug, boostJob, getCompanyJobs } = require("../controller/jobsController.js");
const Jobs = require("../models/jobModel.js");
const paginatedResults = require("../middlewares/pagginator");
const { protect } = require("../middlewares/auth.js");
const { protectPilot } = require("../middlewares/createPilot.js");

const router = express.Router();

router.post("/createJob", protectPilot, sendData);
router.get("/getFilterJob", getFilterJobs);
router.get("/getJobs", paginatedResults(Jobs), getJobs);
router.get("/jobLanding/:id", jobLanding);
router.post("/applyJob/:id", protect, applyJob)
router.post("/likeJob/:id", protect, likeJob)
router.post("/unlikeJob/:id", protect, unlikeJob)
router.post("/pendingJobs", protect, getPendingJobs);
router.post("/expiredJobs", protect, getExpiredJobs);
router.post("/approvedJobs", protect, getApprovedJobs);
router.post("/deleteJob/:id",protect, deleteJob);
router.post("/editJob/:id",protectPilot, editJob);
// jobs applications
router.post("/getApplications/:id", getApplications);
router.post("/expireJob", expireJob);
router.post("/filterJobs", filterJobs)
router.get("/getJobByName/:userId", getJobByName)
router.get("/getIdBySlug/:slug", getIdBySlug)
router.post("/boostJob",protectPilot, boostJob)
router.get("/getCompanyJobs/:slug", getCompanyJobs)

module.exports = router;