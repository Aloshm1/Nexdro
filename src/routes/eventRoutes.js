const express = require("express");
const multer = require('multer');
const { createEvent, getAllEvents, getEvent, eventDetails, getEventsTrending } = require("../controller/eventController");


const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})
const upload1 = multer({storage}).single('file')

router.post("/createEvent",upload1, createEvent)
router.get("/getAllEvents",getAllEvents)
router.get("/eventDetails/:slug", eventDetails)
router.post("/getEvent/:id", getEvent)
router.get("/getEventsTrending", getEventsTrending)
module.exports = router;