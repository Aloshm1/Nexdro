const express = require("express");
const { createComment, getComments, deleteComment,likeComment, unlikeComment, getMyComments, getMyUserId } = require("../controller/commentsController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

router.post("/createComment/:id",protectPilot, createComment);
router.get("/getComments/:id",getComments);

router.post("/likeComment",protectPilot, likeComment);
router.post("/unlikeComment",protectPilot, unlikeComment);
router.post("/getMyComments",protect, getMyComments);
router.post("/getMyUserId",protect, getMyUserId);
router.post('/deleteComment',protectPilot,deleteComment)
module.exports = router;
