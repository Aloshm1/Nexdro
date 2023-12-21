const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'jobs'},
    pilotId: {type: mongoose.Schema.Types.ObjectId, ref: 'pilots'},
    message: {type: String},
    status:{type:String, default: "Pending"}
}, {timestamps:true})

module.exports= mongoose.model('jobApplications', jobApplicationSchema);
