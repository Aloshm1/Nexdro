const express = require("express");
const { createFolder, getMyFolders, getFolderData, deleteFolder, getFolderDetails, updateFolderData } = require("../controller/savePilotFolderController");
const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();


router.post("/createFolder", protectPilot, createFolder)
router.get("/getMyFolders", protectPilot, getMyFolders)
router.post("/getFolderData" , getFolderData)
router.post("/deleteFolder", deleteFolder)
router.post("/getFolderDetails", getFolderDetails)
router.post("/updateFolderData", updateFolderData)

module.exports = router;