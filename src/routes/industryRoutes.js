const express = require("express");
const { createIndustry, getIndustries, deleteIndustry } = require("../controller/industryController");
const router = express.Router();


router.post("/createIndustry", createIndustry);
router.get("/getIndustries", getIndustries);
router.post("/deleteIndustry/:id", deleteIndustry);


module.exports = router;