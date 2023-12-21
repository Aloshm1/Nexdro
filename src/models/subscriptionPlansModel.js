const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
   
    name: {type: String},
    description: {type: String},
    price: {type: Number},
    gst: {type: String},
    vaidity: {type: String},
    images: {type:Number},
    videos: {type:Number},
    images3d: {type:Number},
    draft:{type:Boolean},
    multiple:{type:Boolean},
    approval:{type:Boolean},
    jobNotifications:{type:Boolean},
    suggestions:{type:Boolean},
    proLabel:{type:Boolean},
    rearrange:{type:Boolean},
    hireButton:{type:Boolean},
    forWhom:{type:String}
   

}, {timestamps: true})


module.exports = mongoose.model('subscriptions', subscriptionSchema);
