const draftJobModel = require("../models/draftJobModel");
const jobModel = require("../models/jobModel.js");
const companyModel = require("../models/companyModel.js")

exports.createDraft = async (req, res) => {
    const user = req.user._id;
    const {
      jobTitle,
      industry,
    
      jobType,
      employeeType,
      minSalary,
      maxSalary,
      salaryType,
      workLocation,
      jobDesc,
      noOfOpenings,
      experience
    } = req.body;
    let z = Math.floor(100000 + Math.random() * 900000);
    let r = `${z}-`
    let tempTitle = jobTitle.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(" ").join("-")
    let slugtemp = r+tempTitle
    const job = new draftJobModel({
      userId : user,
   
      jobTitle,
      industry,
     
      jobType,
      employeeType,
      minSalary,
      maxSalary,
      salaryType,
      workLocation,
      jobDesc,
      noOfOpenings,
      slug: slugtemp,
      experience
    });
    try {
      const a1 = await job.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
  };
  
  exports.getMyDrafts = async (req, res)=>{
    const user = req.user._id;

      await draftJobModel.find({userId: user}).exec((err, result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }

  exports.deleteDraft = async (req, res)=>{
    console.log(req.body)
      const id = req.body.jobId
      draftJobModel.deleteOne({_id: id}).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
  }


exports.submitDraft = async (req, res)=>{
  const user = req.user._id;
  const {
    jobTitle,
    industry,
    jobType,
    employeeType,
    minSalary,
    maxSalary,
    salaryType,
    workLocation,
    jobDesc,
    noOfOpenings,
    draftId,
    experience
  } = req.body;
  let z = Math.floor(100000 + Math.random() * 900000);
  let r = `${z}-`
  let tempTitle = jobTitle.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(" ").join("-")
  let slugtemp = r+tempTitle
  console.log(req.body)
await  companyModel.findOne({userId  : req.user._id}).exec(async (err,result1)=>{
  if(err){
    console.log(err)
  }else{
    const job = new jobModel({
      userId : user,
      postingDate : Date.now(),
      jobTitle,
      industry,
     companyId : result1._id,
      jobType,
      employeeType,
      minSalary,
      maxSalary,
      salaryType,
      workLocation,
      jobDesc,
      noOfOpenings,
      slug: slugtemp,
      experience
    });
    try {
      const a1 = await job.save();
       draftJobModel.findOneAndDelete({_id: draftId}).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send("Saved and Deleted")
        }
    })
    } catch (err) {
      res.send("error");
    }
  }
})
  
 
}


exports.getDetails = async (req, res)=>{
  const {draftId} = req.body;
  await draftJobModel.findOne({_id: draftId}).exec((err, result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}