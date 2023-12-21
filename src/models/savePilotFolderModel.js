const mongoose = require('mongoose');

const savePilotFolderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    folderName: {type: String},
    description:{type:String}
}, {timestamps:true})

module.exports= mongoose.model('savePilotFolders', savePilotFolderSchema);
