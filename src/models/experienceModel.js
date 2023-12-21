const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    companyName:{type:String},
    workType:{type:String},
    role:{type:String},
    startDate:{type:String},
    endDate:{type:String},
    location:{type:String}
    
    
   
}, {timestamps:true})

module.exports= mongoose.model('experiences', experienceSchema);
