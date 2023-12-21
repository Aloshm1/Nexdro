const express = require("express");
const multer = require('multer');

const { createBlog, getBlogs, getBlogsTrending, blogDetails, getAllBlogs, getBlog, deleteBlog, viewBlog, getAllBlogs1 } = require("../controller/blogController");

const { protect } = require("../middlewares/auth");

const { protectPilot } = require("../middlewares/createPilot");

const router = express.Router();
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})
const upload1 = multer({storage}).single('file')

router.post("/createBlog",upload1, createBlog)
router.get("/getBlogs/:category", getBlogs)
router.get("/getBlogsTrending", getBlogsTrending)
router.get("/blogDetails/:slug", blogDetails)
router.get("/getAllBlogs",getAllBlogs1)
router.post("/getBlog/:id", getBlog)
router.post("/deleteBlog", deleteBlog)
router.post("/viewBlog", viewBlog)
module.exports = router;