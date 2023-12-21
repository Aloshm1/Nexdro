const mongoose = require('mongoose');

const brandsSchema = new mongoose.Schema({
    brand: {type: String},
}, {timestamps:true})

module.exports= mongoose.model('brands', brandsSchema);
