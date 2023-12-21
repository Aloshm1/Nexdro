const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    profilePic:{type: String,
      default : "static/pilot-profilePic.png"
  },
  coverPic:{type:String,
  default: "static/pilot-coverPic.png"},

    region: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNo: {
      type: String,
    },country: {
      type: String,
    },
    userName:{
      type:String
    },
    password: {
      type: String,
    },
    dob: { type: String },
    gender:{type: String},
    city:{type:String},
    bio:{type:String},

    role: {
      type: String,
      enum: ["pilot", "service_center", "visitor", "company", "booster", "halfCompany", "halfPilot"],
      
    },
    verify:{
      type: Boolean,
      default: false
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "6215cecc307a08691052fcf0",
    },
 
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    savedPilots: [{ type: mongoose.Schema.Types.ObjectId, ref: "pilots" }],
    markedCenters: [{ type: mongoose.Schema.Types.ObjectId, ref: "service_centers" }],
    likedMedia: [{ type: mongoose.Schema.Types.ObjectId, ref: "images" }]
, likedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }]
,    likedReviews:[{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'  }],

downloadedMedia: [{ type: mongoose.Schema.Types.ObjectId, ref: "images" }],
droneNews: {type:Boolean, default: true},
deactivate: {type:Boolean, default: false},
accountPrivacy: {type:Boolean, default: true},
hiresMe: {type:Boolean, default: true},
followsMe: {type:Boolean, default: true},
enquiresMe: {type:Boolean, default: true},
commentsMe: {type:Boolean, default: true},
appliesMe: {type:Boolean, default: true},
pilotPro: {type:Boolean, default: false},
companyPlatinum: {type:Boolean, default: false},
messageAlerts: {type:Boolean, default: true},
jobNotifications: {type:Boolean, default:true}
},

  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
