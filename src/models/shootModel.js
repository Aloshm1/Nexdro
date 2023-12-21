const mongoose = require('mongoose');

const shootSchema = new mongoose.Schema({
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: "images" },
    pilotId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    place: {type:Number}
   
    

}, {timestamps:true})

module.exports= mongoose.model('shoots', shootSchema);
