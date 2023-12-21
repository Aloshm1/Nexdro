const express = require("express");
const { createCompany, getCompanies, onProcess, companyData, editCompanyData, getCompanyAddress, updateCompanyAddress, setViews, setProposals, getCompanySubscription, getPlatinumCompanies, getCompanyData, tempController, updateCompanyDetails, getCompanyDetails } = require("../controller/companyController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();


router.post("/registerCompany", protectPilot,  createCompany );
router.get("/getCompanies", getCompanies)
router.post("/putOnProcess", protect, onProcess)
router.get("/companyData", protectPilot, companyData)
router.post("/editCompanyData", protectPilot, editCompanyData)
router.post("/getCompanyAddress", protect, getCompanyAddress)
router.post("/updateCompanyAddress", protectPilot, updateCompanyAddress)
router.post("/setViews", protectPilot, setViews)
router.post("/setProposals", protect, setProposals)
router.get("/getCompanySubscription", protectPilot, getCompanySubscription)
router.get("/getPlatinumCompanies", getPlatinumCompanies)
router.get("/getCompanyData/:slug", getCompanyData)
router.post("/temp", tempController)
router.post("/updateCompanyDetails", protectPilot, updateCompanyDetails)
router.get("/getCompanyDetails", protectPilot, getCompanyDetails)
module.exports = router;
