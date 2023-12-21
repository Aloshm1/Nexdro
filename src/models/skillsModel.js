const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
    skill: {type: String},
}, {timestamps:true})

module.exports= mongoose.model('skills', skillsSchema);
