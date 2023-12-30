const replyModel = require('../models/replyModel')
const Reply=require('../models/replyModel')
exports.createReply=async(req,res)=>{
const {commentId,reply}=req.body
const userId=req.user.id
const data={commentId:commentId,
             userId:userId,
            reply:reply                }
Reply.create(data).then((response)=>{
    console.log(response)
    res.send(response)
   
})
}

exports.getReplies=async(req,res)=>{
    
    const {commentId}=req.params
    console.log(commentId,'idofreply')
    const replys=await Reply.find({commentId:commentId}).populate('userId')
    res.send(replys)
    
    
}
exports.deleteReply=async(req,res)=>{
    const {replyId}=req.body
    await replyModel.findOneAndDelete({_id:replyId}).then((response)=>{
        res.json(response)
    })
 
}