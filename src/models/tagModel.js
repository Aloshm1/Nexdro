const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag:{type:String, unique: true},
    slug: {type:String, unique:true},
    metaTitle: {type:String},
    metaKeywords: {type:String},
    metaDescription: {type:String},
}, {timestamps:true})

module.exports= mongoose.model('tags', tagSchema);
