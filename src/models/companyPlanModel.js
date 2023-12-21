const mongoose = require('mongoose');

const companyPlanSchema = new mongoose.Schema({
    planName: {type: String},
    activeJobs: {type:Number},
    directHires: {type:Number},
    draftJobs:{type:Number},
    bookmarkPilots:{type:Boolean},
    suggestedPilots:{type:Boolean},
    proBadge:{type:Boolean},
    boostJob:{type:Number},
    
}, {timestamps:true})

module.exports= mongoose.model('companyPlans', companyPlanSchema);
