const mongoose = require('mongoose');


const draftImageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    name:{type:String},
    file: {type:String},
    postName: { type: String},
    fileType: {type: String},
    category: {type:String},
    experience:{type:String},
    keywords: [String],
   adult: {type:Boolean},
   rejectReason: {type:String},
   status:{
    type: String,
    enum: ["active", "pending", "rejected"],
    default: 'pending'
   },
   views: [ {type: mongoose.Schema.Types.ObjectId, ref: "users" }],
   downloads: [ {type: mongoose.Schema.Types.ObjectId, ref: "users" }],
   likes: [ {type: mongoose.Schema.Types.ObjectId, ref: "users" }],
   slug:{type:String}
}, {timestamps:true})

module.exports= mongoose.model('draftImage', draftImageSchema);



