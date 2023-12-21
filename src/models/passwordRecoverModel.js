const mongoose = require('mongoose');

const passwordTokenSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
   token:{
      type:String,
   }
    }, {timestamps:true});

module.exports= mongoose.model('passwordRecover', passwordTokenSchema);
