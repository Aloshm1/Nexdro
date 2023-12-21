const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    pilotProfile: {type:String},
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'service_centers'},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    pilotName: {type:String},
    rating: {type:Number},
    review: {type:String},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
    shares: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}]
}, {timestamps:true})

module.exports= mongoose.model('reviews', reviewSchema);
