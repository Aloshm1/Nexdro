const express = require("express");
const { createCategory, getCategories, getOneCategory, getAllCategories, getOnlyCategories, deleteCategory } = require("../controller/categoryController");

const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
router.post("/createCategory", createCategory)
router.get("/getCategories", getCategories)
router.get("/getOneCategory/:slug", getOneCategory)
router.get("/getAllCategories", getAllCategories)
router.get("/getOnlyCategories", getOnlyCategories)
router.post("/deleteCategory", deleteCategory)
module.exports = router;