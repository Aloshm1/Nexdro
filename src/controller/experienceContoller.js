const experienceModel = require("../models/experienceModel");
const pilotModel = require("../models/pilotModel");

exports.createExperience =async (req,res) =>{
    const { companyName, role, workType, startDate, endDate, location } =
      req.body;
    const _experience = new experienceModel({
        companyName, role, workType, startDate, endDate, location, userId: req.user._id
    });
    try {
      const a1 = await _experience.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
}

exports.getMyExperience = async (req,res)=>{
  experienceModel.find({userId: req.user._id}).sort({createdAt : -1}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}
exports.deleteExperience = async (req,res)=>{
  experienceModel.findOne({_id : req.params.id}).deleteOne((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}

exports.getPilotExperience = async (req,res)=>{
 
  pilotModel.find({userName: req.params.userName}).exec((err,result)=>{
      if(err){
          res.send(err)
      }else{
          if(result.length === 0){
              res.send("No Pilot Available")
          }else{
              experienceModel.find({userId: result[0].userId}).sort({createdAt : -1}).exec((err,result)=>{
                  if(err){
                      res.send(err)
                  }else{
                      res.send(result)
                  }
              })
          }
      }
  })
}

exports.getExperienceById = async (req,res)=>{
  await experienceModel.findOne({_id: req.params.id}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}

exports.editExperience = async (req,res)=>{
  const {companyName, role, location, workType, startDate, endDate} = req.body
  experienceModel.findOne({_id: req.params.id}).updateOne({companyName, role, location, workType, startDate, endDate}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}