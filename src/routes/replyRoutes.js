const express=require('express')
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const {createReply,getReplies,deleteReply}=require('../controller/replyController')

const router=express.Router()
router.post('/createReply',protectPilot,createReply)
router.get('/getReplies/:commentId',getReplies)
router.post('/deleteReplyComment',protectPilot,deleteReply)



module.exports=router