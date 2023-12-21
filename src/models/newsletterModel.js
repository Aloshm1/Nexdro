const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {type:String}
  
}, {timestamps: true})

module.exports = mongoose.model('newsLetter', newsletterSchema);
