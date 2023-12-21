const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    image: {type: String},
    category: {type: String},
    title: {type: String},
    date: {type: String},
    location: {type: String},
    description: {type: String},
    metaTitle: {type: String},
    metaDescription: {type: String},
    metaKeywords: {type: String},
    slug: {type: String, unique: true},
    views: {type:Number}
    

}, {timestamps:true})

module.exports= mongoose.model('blogs', blogSchema);
