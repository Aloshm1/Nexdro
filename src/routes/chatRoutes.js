const express = require("express");
const { createChat, getChatDetails, getMyChats, getChatDetailsPopulated, makemessagesRead, getCompanyChat, getCenterEnquiry, getUnreadChats } = require("../controller/chatController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
router.post("/createChat",protectPilot, createChat)
router.get("/getChatDetails/:id", getChatDetails)
router.get("/getChatDetailsPopulated/:id", getChatDetailsPopulated)
router.get("/getMyChats", protectPilot, getMyChats)
router.post("/makemessagesRead/:chatId", protect, makemessagesRead)
router.post("/getCompanyChat", protectPilot, getCompanyChat)
router.post("/getCenterEnquiry", protectPilot, getCenterEnquiry)
router.post("/getUnreadChats", protectPilot, getUnreadChats)
module.exports = router;