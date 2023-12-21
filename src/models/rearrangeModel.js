const mongoose = require('mongoose');

const rearrangeSchema = new mongoose.Schema({
    media: [{type: mongoose.Schema.Types.ObjectId, ref: 'images'}],
    fileType: {type: String},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
}, {timestamps:true})

module.exports= mongoose.model('rearrange', rearrangeSchema);
