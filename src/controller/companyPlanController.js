const companyPlanModel = require("../models/companyPlanModel");

exports.createPlan = async (req, res) => {
  const {
    planName,
    activeJobs,
    directHires,
    draftJobs,
    bookmarkPilots,
    suggestedPilots,
    proBadge,
    boostJobs,
  } = req.body;
  const _plan = new companyPlanModel({
    planName,
    activeJobs,
    directHires,
    draftJobs,
    bookmarkPilots,
    suggestedPilots,
    proBadge,
    boostJobs,
  });
  try {
    const a1 = await _plan.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
};

exports.getAllCompanyPlans = async (req,res)=>{
  companyPlanModel.find({}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}