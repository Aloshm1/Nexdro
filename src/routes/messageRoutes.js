const express = require("express");
const { createMessage, getMessages, getNotRead } = require("../controller/messageController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
router.post("/createMessage", protectPilot, createMessage)
router.get("/getMessages/:chatId", getMessages)
router.get("/getNotRead/:chatId", protectPilot, getNotRead)
module.exports = router;