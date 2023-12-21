const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    query:{type:String},
    answer: {type:String}
}, {timestamps:true})

module.exports= mongoose.model('faqs', faqSchema);
