const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
   name:{type:String},
   link:{type:String},
   imageId:{type: mongoose.Schema.Types.ObjectId, ref: 'images'},
   centerId: {type: mongoose.Schema.Types.ObjectId, ref: 'service_center'},
   pilotId: {type: mongoose.Schema.Types.ObjectId, ref: 'pilots'},
}, {timestamps:true})

module.exports= mongoose.model('activity', activitySchema);
