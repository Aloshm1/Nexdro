const mongoose = require('mongoose');

const keywordsSchema = new mongoose.Schema({
    keyword: {type: String},
}, {timestamps:true})

module.exports= mongoose.model('keywords', keywordsSchema);
