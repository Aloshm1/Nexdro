const express = require("express");
const {createNewsLetter, createNews} = require("../controller/newsletterController")
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");


const router = express.Router();

// router.post("/createNewsletter", createNewsLetter)
router.post("/createNewsletter", createNews)
module.exports = router;