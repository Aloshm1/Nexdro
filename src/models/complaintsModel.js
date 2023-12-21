const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
  name: {type:String},
  email:{type:String},
  phone:{type:String},
  country:{type:String},
  subject:{type:String},
  query:{type:String}

}, {timestamps:true})

module.exports= mongoose.model('complaints', complainSchema);
