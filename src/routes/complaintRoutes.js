const express = require("express");
const { createBrand, getBrands, deleteBrand, getOnlyBrands } = require("../controller/brandsController");
const { createComplain } = require("../controller/complaintController");

const router = express.Router();
router.post("/createComplain", createComplain)

module.exports = router;