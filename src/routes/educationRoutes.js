const express = require("express");
const { createEducation, getMyEducation, deleteEducation, getEducationById, editEducation, getPilotEducation } = require("../controller/educationContoller");

const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
router.post("/createEducation", protectPilot, createEducation)
router.get("/getMyEducation", protectPilot, getMyEducation)
router.post("/deleteEducation/:id", deleteEducation)
router.get("/getEducationById/:id", getEducationById)
router.post("/editEducation/:id", editEducation)
router.get("/getPilotEducation/:userName", getPilotEducation)

module.exports = router;