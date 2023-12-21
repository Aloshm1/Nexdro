const express = require("express");
const { createFollow, getMyFollowing, removeFollow, getMyFollowingPopulated, singlePilot1, getMyFollowersPopulated, getUserFollowing, getPilotFollowers, unfollow, unfollow1 } = require("../controller/followController");

const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post("/createFollow/:id",protect, createFollow);
router.post("/removeFollow/:id",protect, removeFollow);
router.post("/getMyFollowing",protect, getMyFollowing);
router.post("/singlePilot1", singlePilot1);
router.post("/getMyFollowingPopulated",protect, getMyFollowingPopulated);
router.post("/getMyFollowersPopulated",protect, getMyFollowersPopulated);
router.get("/getUserFollowing/:id", getUserFollowing);
router.get("/getUserFollowers/:id", getPilotFollowers);

router.post("/unfollow/:id",protect, unfollow);
router.post("/unfollow1/:id",protect, unfollow1);


module.exports = router;
