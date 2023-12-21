const express = require("express");
const { getPendingJobs, approveJob,pendingJob, getActiveJobs, getImages, approveImage, getApprovedImages, putPendingImage, rejectImage, getRejectedImages, getNumberofAll } = require("../controller/adminController");
const { protect } = require("../middlewares/auth.js");


const router = express.Router();

router.get("/getPendingJobs", getPendingJobs);
router.get("/getActiveJobs", getActiveJobs);
router.post("/approve/:id", protect, approveJob)
router.post("/pending/:id", protect, pendingJob)
router.get("/images", getImages)
router.get("/activeImages", getApprovedImages)
router.get("/rejectedImages", getRejectedImages)
router.post("/approveImage/:id",  approveImage)
router.post("/putPendingImage/:id",  putPendingImage)
router.post("/rejectImage/:id",  rejectImage)
router.get("/getData",  getNumberofAll)


module.exports = router;