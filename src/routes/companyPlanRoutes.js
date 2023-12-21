const express = require("express");
const { createBrand, getBrands, deleteBrand } = require("../controller/brandsController");
const { createPlan, getAllCompanyPlans } = require("../controller/companyPlanController");

const router = express.Router();

router.post("/createPlan", createPlan)
router.get("/getAllCompanyPlans", getAllCompanyPlans)



module.exports = router;