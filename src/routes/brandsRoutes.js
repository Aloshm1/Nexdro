const express = require("express");
const { createBrand, getBrands, deleteBrand, getOnlyBrands, getBrands1 } = require("../controller/brandsController");

const router = express.Router();


router.post("/createBrand", createBrand);
router.get("/getBrands", getBrands);
router.post("/deleteBrand/:id", deleteBrand);
router.get("/getOnlyBrands", getOnlyBrands)
router.get("/getBrands1", getBrands1)

module.exports = router;