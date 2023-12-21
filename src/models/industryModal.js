const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
    industry: {type: String},
}, {timestamps:true})

module.exports= mongoose.model('industries', industrySchema);
