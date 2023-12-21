const mongoose = require('mongoose');

const ipschema = new mongoose.Schema({
   ip:{type:String}
}, {timestamps:true})

module.exports= mongoose.model('ips', ipschema);
