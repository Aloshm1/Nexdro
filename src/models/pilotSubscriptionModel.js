const mongoose = require('mongoose');

const pilotSubscriptionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
   
    plan: {type: String},
    paymentId: {type: String},
    images: {type:Number},
    videos: {type:Number},
    images3d: {type:Number},
  
}, {timestamps: true})

module.exports = mongoose.model('pilotSubscription', pilotSubscriptionSchema);
