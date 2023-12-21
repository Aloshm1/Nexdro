const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    profilePic: {type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'images'},
    name: {type:String},
    comment: {type:String},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
    profilePic: {type:String}
}, {timestamps:true})

module.exports= mongoose.model('comments', commentsSchema);
