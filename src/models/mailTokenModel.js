
const mongoose = require('mongoose');

const mailTokenSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
   token:{
      type:String,
   }
    }, {timestamps:true});

module.exports= mongoose.model('mailTokens', mailTokenSchema);
