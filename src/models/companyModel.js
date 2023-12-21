const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    onProcess:[{type: mongoose.Schema.Types.ObjectId, ref: 'pilots'}],
    selected:[{type: mongoose.Schema.Types.ObjectId, ref: 'pilots'}],
    closed:[{type: mongoose.Schema.Types.ObjectId, ref: 'pilots'}],
    rejected:[{type: mongoose.Schema.Types.ObjectId, ref: 'pilots'}],

companyType: {
    type: String,
    enum: ["company", "consultant"],
},
   companyName:{
        type:String,
    },
    emailId:{
        type:String,
    },
    phoneNo:{
        type: String,

    },
    contactPersonName: {
        type: String,

    },
    industry:{
        type:String,
    },
    address:{
        type:String,
    },
    line1:{
        type:String
    },
    line2:{
        type:String
    },
    city: {
        type:String,
    },
    country:{
        type:String,
    },
    state:{
        type:String
    },
    postalAddress:{
        type:String,
    },
    gstNo:{
        type:String,
    },
    startedIn:{
        type:String,

    },
    experience:{
        type:String,
    },
    
    profilePic:{type: String,
      default : "static/pilot-profilePic.png"
  },
  coverPic:{type:String,
  default: "static/pilot-coverPic.png"},
    description:{
        type:String,
    },
    views:{
        type: Number,
        default: 0
    },
    viewed: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    proposals: {
        type:Number,
        default: 0
    },
    jobBoosts:{type:Number, default:0},
    companyPro: {type:Boolean, default:false},
    slug:{type:String, unique:true},
    tagline:{type:String},
    foundingYear:{type:String},
    companySize:{type:String},
    website:{type:String},
    location:{type:String},
    summary:{type:String}

}, {timestamps:true})

module.exports= mongoose.model('companies', companySchema)