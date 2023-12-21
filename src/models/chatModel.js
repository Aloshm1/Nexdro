const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatType:{type:String},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    jobId:{type: mongoose.Schema.Types.ObjectId, ref: 'jobs'},
    centerId:{type: mongoose.Schema.Types.ObjectId, ref: 'service_center'},
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'companies'},
    update: {type:Number},
    status:{type:String, default: "pending"},
    lastChat:{type: mongoose.Schema.Types.ObjectId, ref: 'messages'},
    
   
}, {timestamps:true})

module.exports= mongoose.model('chats', chatSchema);
