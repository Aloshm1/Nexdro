const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    userRole: {
        type: String,
        enum: ["pilot", "service_center", "visitor", "company", "booster"],
      },
    plan: {type: String},
    transactionId: {type:String},
    price: {type: Number},
    gst: {type:Number},
    status: {type: String},
    name: {type:String},
    line1:{type:String},
    line2:{type:String},
    city:{type:String},
    country:{type:String},
    state:{type:String},
    pinCode:{type:String},
    gstNo:{type:String}

}, {timestamps:true})

module.exports= mongoose.model('payments', paymentSchema);
