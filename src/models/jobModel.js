const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        // required: true
    },
    companyName: {
        type: String,
        // required: true
    },
    jobTitle: {
        type: String,
        // required: true
    },
    industry: {
        type:String,
    },
    address: {
        type:String,

    },
    city:{
        type: String,
    },
    state: {
        type:String,
    },
    country: {
        type:String
    },
    jobType:{
        type:String
    },
    employeeType:{
        type:String,
    },
    maxSalary:{
        type:Number,
    },
    minSalary:{
        type:Number,
    },
    salaryType:{
        type:String,
    },
    postingDate:{
        type:Date,
        default: Date.now,
    },
    noOfOpenings:{
        type:Number,
    },
    jobDesc:{
        type:String,
    },
    workLocation:{
        type:String,
    },
    applications:[{type: mongoose.Schema.Types.ObjectId, ref: 'pilots'}],
    status:{
        type:String,
        default: "active"
     

    },
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'companies'},
    slug:{type:String},
    experience:{type:String},
    boostCount:{type:Number, default:0}
}, {timestamps: true});

module.exports = mongoose.model("jobs",jobSchema);
