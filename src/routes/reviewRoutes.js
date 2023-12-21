const express = require("express");
const { createReview, getReview, writeReview, likeReview, likeJob, unlikeReview, getReviews, getSample } = require("../controller/reviewController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post("/createReview", createReview);
router.post("/writeReview/:id",protectPilot, writeReview);
router.post("/likeReview",protectPilot, likeReview);
router.post("/unlikeReview",protectPilot, unlikeReview);
router.get("/getReviews/:id", getReview);
router.get("/getReviews1/:id", getReviews);
router.get("/getSample", getSample);


module.exports = router;
