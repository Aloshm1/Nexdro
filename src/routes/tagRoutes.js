const express = require("express");
const { createTag, getTags, imageFilters, deleteTag, editPost, getTag, getTagData } = require("../controller/tagController");

const router = express.Router();

router.post("/createTag", createTag)
router.get('/getTags', getTags)
router.post("/imageFilters", imageFilters)
router.post("/deleteTag", deleteTag)
router.post("/editTag", editPost)
router.post("/getTag/:id", getTag)
router.get("/getTagData/:slug", getTagData)
module.exports = router;