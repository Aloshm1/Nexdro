const mongoose = require('mongoose');

const savePilotSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    folderId: {type: mongoose.Schema.Types.ObjectId, ref: 'savePilotFolders'},
    pilotId: {type: mongoose.Schema.Types.ObjectId, ref: 'pilots'},
  
}, {timestamps:true})

module.exports= mongoose.model('savePilots', savePilotSchema);
