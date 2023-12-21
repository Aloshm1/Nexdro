const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    instituteName:{type:String},
    courseName:{type:String},
    startDate:{type:String},
    endDate:{type:String},
    
    
   
}, {timestamps:true})

module.exports= mongoose.model('educations', educationSchema);
