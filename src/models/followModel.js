const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    followerId: {type: mongoose.Schema.Types.ObjectId, ref: 'pilots'}
}, {timestamps:true})

module.exports= mongoose.model('follow', followSchema);
