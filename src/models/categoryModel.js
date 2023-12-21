const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category:{type:String},
    slug: {type:String, unique:true},
    metaTitle: {type:String},
    metaKeywords: {type:String},
    metaDescription: {type:String},
}, {timestamps:true})

module.exports= mongoose.model('categories', categorySchema);
