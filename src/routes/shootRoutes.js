const express = require("express");
const { createShoot, getShoots, setPlace } = require("../controller/shootController");

const router = express.Router();

router.post("/createShoot", createShoot)
router.get("/getShoots", getShoots)
router.post("/setPlace", setPlace)


module.exports = router;