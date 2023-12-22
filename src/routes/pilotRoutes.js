const express = require("express");
const multer = require('multer');

const { createpilot, getPilots, deactivatedPilots, hirePilots, hirePilotsFilters, appliedJobs, savedJobs, hiredJobs, likedJobs, getaApliedJobs, singlePilot, pilotLanding, savePilot, getLicensedPilots, getUnlicensedPilots, activatePilot, deactivatePilot, getLikedMedia, getDownloadedMedia, getPilotMedia, getPilotId, getMyProfilePictures, updateBasicInfo, updateProfessionalInfo, updateProfessionalInfo1, savePilot1, appliedJobsMine, pilotFilters, getSuggestions, rearrangeImages, rearrangeVideos, rearrange3d,sendBillingData, updateBillingAddress, checkUserName, similarPilots, updatePilotInfo, updatePilotInfo1, getActivity, viewPilotProfile } = require("../controller/pilotController");


const paginatedResults1 = require("../middlewares/hirejobPagginator");
const Pilot =  require('../models/pilotModel.js')
const {protect} = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");


const router = express.Router();


const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload1 = multer({storage}).single('file')

router.post("/registerpilot",protectPilot, upload1, createpilot);
router.get("/getPilots", getPilots);
router.get("/pilotDetails/:id", pilotLanding);
router.get("/deactivatedPilots/:id", deactivatedPilots);

router.post("/getSinglePilot",protect, singlePilot);
router.get("/hirePilots", paginatedResults1(Pilot), hirePilots);
router.get("/getPilotsFilters", hirePilotsFilters);

//pilot dashboard
router.post("/getAppliedJobs", protect ,appliedJobs);
router.post("/getSavedJobs", protect ,savedJobs);
router.get("/getHiredJobs", protect ,hiredJobs);
router.post("/getLikedJobs", protect ,likedJobs);
router.post("/getAppliedJobs1", protect ,getaApliedJobs);
router.post("/savePilot/:id", protect ,savePilot1);


router.get("/getLicensedPilots", getLicensedPilots);
router.get("/getUnlicensedPilots", getUnlicensedPilots);
router.post("/activatePilot/:id", activatePilot);
router.post("/deactivatePilot/:id", deactivatePilot);
router.post("/getLikedMedia",  protect, getLikedMedia );
router.post("/getDownloadedMedia",  protect, getDownloadedMedia );
router.get("/getPilotMedia/:id", getPilotMedia );
router.post("/getPilotId", getPilotId );
router.get("/getMyProfilePictures", getMyProfilePictures );
router.post("/updateBasicInfo", protectPilot, updateBasicInfo );
router.post("/updateProfessionalInfo", protectPilot, updateProfessionalInfo );
router.post("/updateProfessionalInfo1", protectPilot, upload1, updateProfessionalInfo1 );
router.get("/appliedJobsMine", protectPilot, appliedJobsMine);
router.post("/pilotFilters", pilotFilters)
router.post("/getSuggestions", getSuggestions)
router.post("/rearrangeImages", protectPilot, rearrangeImages)
router.post("/rearrangeVideos", protectPilot, rearrangeVideos)
router.post("/rearrange3d", protectPilot, rearrange3d)
router.post("/sendBillingAddress", protect, sendBillingData)
router.post("/updateBillingAddress", protectPilot, updateBillingAddress)
router.post("/checkUserName", checkUserName)
router.get("/similarPilots/:id", similarPilots)
router.post("/updatePilotInfo", protectPilot, updatePilotInfo)
router.post("/updatePilotInfo1", protectPilot, upload1,updatePilotInfo1)
router.get("/getActivity/:userName", getActivity)
router.post("/viewPilotProfile/:id", viewPilotProfile)
module.exports = router;

