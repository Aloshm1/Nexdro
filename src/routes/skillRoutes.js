const express = require("express");
const { createSkill, getSkills, deleteSkill } = require("../controller/skillsController");

const router = express.Router();


router.post("/createSkill", createSkill);
router.get("/getSkills", getSkills);
router.post("/deleteSkill/:id", deleteSkill);

module.exports = router;