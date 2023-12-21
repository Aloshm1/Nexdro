const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message:{type:String},
    chatId:{type: mongoose.Schema.Types.ObjectId, ref: 'chats'},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    readBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    
}, {timestamps:true})

module.exports= mongoose.model('messages', messageSchema);
