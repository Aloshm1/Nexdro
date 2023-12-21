const express = require("express");
const { createProposal, sampleData, pilotProposals, companyProposals, changeProposalStatus } = require("../controller/hireProposalController");
const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();

router.post("/createProposal", protectPilot, createProposal)
router.post("/sampleData", sampleData)
router.post("/pilotProposals", protect, pilotProposals)
router.post("/companyProposals", protectPilot, companyProposals)
router.post("/changeProposalStatus", changeProposalStatus)


module.exports = router;
