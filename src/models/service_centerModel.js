const mongoose = require('mongoose');

const service_centerSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'users'    },

    centerName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
    },
    phoneNo:{
        type: String,

    },
    whatsappNo:{
        type: String
    },
    address:{
        type: String,
    },
    streetName:{
        type: String,
    },
    areaName:{
        type: String,
    },
    city:{
        type: String,
    },
    state:{
        type:  String,
    },
    country:{
        type: String,
    },
    pincode:{
        type: Number,
    },
    workingHours:{
        type: String,
    },
    secondaryNumber:{
        type: String,
    },
    website:{
        type: String,
    },
    brandOfDrones: [{type: String}],
    services: [{type:String}],
    description:{
        type: String,
    },
    rating: {type: Number},
    followers: [{type: String}],
    following: [{type: String}],
    images: [{type:String}],
    profilePic:{type: String,
        default : "static/pilot-profilePic.png"
    },
    establishedYear: {type:String},
    slug: {type:String},
    holidays: [{type:String}],
    coverPic:{type:String,
    default: "static/pilot-coverPic.png"},
   
  
})

module.exports= mongoose.model('service_center', service_centerSchema)