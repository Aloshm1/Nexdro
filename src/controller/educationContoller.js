const educationModel = require("../models/educationModel");
const pilotModel = require("../models/pilotModel");

exports.createEducation =async (req,res) =>{
    console.log(req.body,'opo')
    const { instituteName, courseName, startDate, endDate } =
      req.body;

    const _education = new educationModel({
        instituteName, courseName, startDate, endDate, userId: req.user._id
    });
    try {
      const a1 = await _education.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
}

exports.getMyEducation = async (req,res)=>{
    educationModel.find({userId: req.user._id}).sort({createdAt: -1}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}
exports.deleteEducation = async (req,res)=>{
    educationModel.findOne({_id: req.params.id}).deleteOne((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.getEducationById = async (req,res)=>{
    educationModel.findOne({_id: req.params.id}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.editEducation = async (req,res)=>{
    educationModel.findOne({_id:req.params.id}).updateOne({
        instituteName: req.body.instituteName,
        courseName: req.body.courseName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}
exports.getPilotEducation = async (req,res)=>{
 
    pilotModel.find({userName: req.params.userName}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            if(result.length === 0){
                res.send("No Pilot Available")
            }else{
                educationModel.find({userId: result[0].userId}).sort({createdAt : -1}).exec((err,result)=>{
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