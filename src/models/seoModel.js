const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    pageName:{type:String, unique:true},
    metaTitle: {type:String},
    metaDescription: {type:String},
    metaKeywords: {type:String},
    title: {type:String},

}, {timestamps:true})

module.exports= mongoose.model('seoFactors', seoSchema);
