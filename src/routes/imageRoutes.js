const express = require("express");
const multer = require('multer');
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const imageModel = require("../models/imageModel");
const router = express.Router();

const upload = require('../middlewares/uploadImage');
const { createImage, getPendingImages, getApprovedImages, getRejectedImages, getPendingVideos, getApprovedVideos, getRejectedVideos, getPending3d, getApproved3d, getRejected3d, deleteImage, getImages, createImage1, getImage, watermarkImage, getUserImages, likeImage, unlikeImage, downloadImage, imageFilters, editImage, editImage1, findImage, getUserImagesOnly, getUser3dOnly, getUserVideosOnly,getFollowersMedia, getUser, viewImage, getSortingImages, getGoodImages, getNextImage, getPreviousImage, getRelatedImages, getPopupImage, getNextPopupImage, getPreviousPopupImage, imageView, homePage, getSearchImages, test } = require("../controller/imageController");

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload1 = multer({storage}).single('file')

router.post("/createImage", protectPilot ,upload1, createImage);
router.post("/getPendingImages", protect ,getPendingImages);
router.post("/getApprovedImages", protect ,getApprovedImages);
router.post("/getRejectedImages", protect ,getRejectedImages);
router.post("/getPendingVideos", protect ,getPendingVideos);
router.post("/getApprovedVideos", protect ,getApprovedVideos);
router.post("/getRejectedVideos", protect ,getRejectedVideos);
router.post("/getPending3d", protect ,getPending3d);
router.post("/getApproved3d", protect ,getApproved3d);
router.post("/getRejected3d", protect ,getRejected3d);
router.post("/deleteImage/:id", protect ,deleteImage);

router.get("/getImages",getImages);
router.get("/getImage/:id",getImage);
router.get("/getUserImages/:id",getUserImages);
router.post("/likeImage/:id", protect ,likeImage);
router.post("/unlikeImage/:id", protect ,unlikeImage);

router.post("/downloadImage/:id", protect ,downloadImage);
router.post("/imageFilters", imageFilters);
router.post("/editImage/:id",protectPilot,upload1, editImage);
router.post("/editImage1/:id",protectPilot,editImage1);
router.post("/findImage",  findImage);

router.get("/getUserImagesOnly/:id",getUserImagesOnly);
router.get("/getUser3dOnly/:id",getUser3dOnly);
router.get("/getUserVideosOnly/:id",getUserVideosOnly);
router.post("/getFollowersMedia",protect,getFollowersMedia);
router.post("/getUser/:id", getUser);
router.post("/viewImage/:id", viewImage);
router.post("/getSortingImages", protect, getSortingImages)
router.get("/getGoodImages", getGoodImages)
router.post("/getNextImage", getNextImage)
router.post("/getPreviousImage", getPreviousImage)
router.post("/getRelatedImages", getRelatedImages)
router.post("/getPopupImage", getPopupImage)
router.post("/getNextPopupImage", getNextPopupImage)
router.post("/getPreviousPopupImage", getPreviousPopupImage)
router.get("/imageView/:id", imageView)
router.post("/homePage", homePage)
router.post("/getSearchImages", getSearchImages)
router.get("/test", test)
module.exports = router;
