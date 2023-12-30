const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    commentId:{type:mongoose.Schema.Types.ObjectId,ref:'comments'},
    reply:{type:String}
}, {timestamps:true})

module.exports= mongoose.model('replies', replySchema);