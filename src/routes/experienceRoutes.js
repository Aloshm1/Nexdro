const express = require("express");
const { createExperience, getMyExperience, deleteExperience, getPilotExperience, getExperienceById, editExperience } = require("../controller/experienceContoller");

const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
router.post("/createExperience", protectPilot, createExperience)
router.get("/getMyExperience", protectPilot, getMyExperience)
router.post("/deleteExperience/:id",deleteExperience )
router.get("/getPilotExperience/:userName", getPilotExperience)
router.get("/getExperienceById/:id", getExperienceById)
router.post("/editExperience/:id", editExperience)
module.exports = router;