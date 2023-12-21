const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    emailId: {type:String},
    phoneNo: {type:String},
    name:{type:String},
    message:{type:String},
    centerId: {type: mongoose.Schema.Types.ObjectId, ref: 'service_centers'},
    location:{type:String},
    status:{type:String, default:"Pending"}


}, {timestamps:true})

module.exports= mongoose.model('enquiries', enquirySchema);


