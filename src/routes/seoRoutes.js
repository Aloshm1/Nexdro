const express = require("express");
const { createSeo, getSeo, getAllSeo, editSeo } = require("../controller/seoController");


const router = express.Router();
router.post("/createSeo", createSeo)
router.get("/getSeo/:page", getSeo)
router.get("/getAllSeo", getAllSeo)
router.post("/editSeo", editSeo)
module.exports = router;