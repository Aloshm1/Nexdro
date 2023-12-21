const mongoose = require('mongoose');

const queriesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    name: {type: String},
    emailId:{type:String},
    query:{type:String},
    description:{type:String},
    status:{type:String,
    default:"pending"},
    answer: {type:String}
}, {timestamps:true})

module.exports= mongoose.model('queries', queriesSchema);
