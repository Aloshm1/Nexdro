const express = require("express");
const { createKeyword, getKeywords, deleteKeyword, jobNotification } = require("../controller/keywordsController");

const router = express.Router();

router.post("/createKeyword", createKeyword);
router.get("/getKeywords", getKeywords);
router.post("/deleteKeyword/:id", deleteKeyword);
router.post("/jobNotification", jobNotification)
module.exports = router;