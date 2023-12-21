const mongoose = require('mongoose');

const hireProposalSchema = new mongoose.Schema({
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: 'companies'},
    pilotId: {type: mongoose.Schema.Types.ObjectId, ref: 'pilots'},
    message: {type: String},
    status:{type:String, default:"In Process"}
}, {timestamps:true})

module.exports= mongoose.model('hireProposals', hireProposalSchema);
