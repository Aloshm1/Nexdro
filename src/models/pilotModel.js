const mongoose = require('mongoose');

const pilotSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'users'},

    name: {type: String},
    profilePhoto:{type:String},
    coverPhoto:{type:String},
    emailId: {type: String},
    phoneNo: {type: String},
    userName:{type:String, unique : true},
    preferredLocation: {type:String},
    dob:{type:String},
    gender:{type:String},
    address:{type:String},
    line1:{type:String},
    line2:{type:String},
    state:{type:String},
    city:{type:String},
    country:{type:String},
    postalAddress:{type:String},
    bio:{type:String},
    pilotType:{type:String},
    pilotPro: {type: Boolean},
    certificates:[{type:String}],
    droneId:{type:String},
    droneType:[{type:String}],
    workType:{type:String},
    hourlyPayment:{type:Number, default: 0},
    monthlyPayment:{type:Number, default: 0},
    industry:[{type:String}],
    deactivate:{
        type:Boolean,default:false
    },
    trainingCenter:{type:String},
    completedYear:{type:String},
    skills: [{type: String}],
    rearrangedImages: [{type: Object}],
    rearrangedVideos: [{type: Object}],
    rearranged3d: [{type: Object}],
    keyswordsVisible: {type:Number, default: 3},
    followers: [{type:  mongoose.Schema.Types.ObjectId, ref: 'pilots'}],
    following: [{type: String}],
    images:[{type: String}],
    rating:{type:Number},
    savedJobs:[{type: mongoose.Schema.Types.ObjectId, ref: 'jobs'  }],
    appliedJobs:[{type: mongoose.Schema.Types.ObjectId, ref: 'jobs'  }],
    hiredJobs:[{type: mongoose.Schema.Types.ObjectId, ref: 'jobs'  }],    
    likedReviews:[{type: mongoose.Schema.Types.ObjectId, ref: 'jobs'  }],
    status:{type: Boolean, default: true},
    profilePic:{type: String,
        default : "profilePictures/david-henrichs-72AYEEBJpz4-unsplash.jpg"
    },
    coverPic:{type:String,

    default: "profilePictures/sean-GaSNjOGtCy0-unsplash.jpg"},
    monthlyExperience:{type:Number},
    yearlyExperience:{type:Number},
    views:{type:Number, default:0},
    viewed:{type:Number, default: 100},
    licenseNo: {type:String}

},{timestamps: true})

module.exports= mongoose.model('pilots', pilotSchema);