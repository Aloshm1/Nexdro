const express = require("express");
const { getRecommended, removeRecommmended, getImagesofRecommended, addRecommmended } = require("../controller/recommendedController");

const router = express.Router();

router.get("/getRecommended", getRecommended)
router.post("/removeRecommended/:id", removeRecommmended)
router.post("/addRecommmended/:id", addRecommmended)
router.post("/getImagesofRecommended", getImagesofRecommended)
module.exports = router;