const mongoose = require('mongoose');

const jobAlertsSchema = new mongoose.Schema({
    email: {type:String}
  
}, {timestamps: true})

module.exports = mongoose.model('jobAlerts', jobAlertsSchema);
