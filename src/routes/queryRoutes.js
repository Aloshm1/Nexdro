const express = require("express");
const { createQuery, getQueries, getAllQueries, answerQuery } = require("../controller/queryController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");


const router = express.Router();
router.post("/createQuery",protectPilot, createQuery);
router.post("/getQueries", protect, getQueries)
router.post("/getAllQueries", getAllQueries)
router.post("/answerQuery", answerQuery)

module.exports = router;