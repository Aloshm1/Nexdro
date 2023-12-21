const express = require("express");
const multer = require('multer');
const {  getDrafts, createDraft1, uploadDraft, deleteDraft } = require("../controller/draftController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();

const upload = require('../middlewares/uploadImage');

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload1 = multer({storage}).single('file')

router.post("/createDraft", protectPilot ,upload1, createDraft1);
router.post("/getDrafts", protect ,getDrafts);
router.post("/uploadDraft", protectPilot ,uploadDraft);
router.post("/deleteDraft", deleteDraft);
// router.post("/getApprovedImages", protect ,getApprovedImages);
// router.post("/getRejectedImages", protect ,getRejectedImages);
// router.post("/getPendingVideos", protect ,getPendingVideos);
// router.post("/getApprovedVideos", protect ,getApprovedVideos);
// router.post("/getRejectedVideos", protect ,getRejectedVideos);
// router.post("/getPending3d", protect ,getPending3d);
// router.post("/getApproved3d", protect ,getApproved3d);
// router.post("/getRejected3d", protect ,getRejected3d);
// router.post("/deleteImage/:id", protect ,deleteImage);

// router.get("/getImages",getImages);
// router.get("/getImage/:id",getImage);
// router.get("/getUserImages/:id",getUserImages);
// router.post("/likeImage/:id", protect ,likeImage);
// router.post("/unlikeImage/:id", protect ,unlikeImage);

// router.post("/downloadImage/:id", protect ,downloadImage);



module.exports = router;
