const savePilotModel = require("../models/savePilotModel");

exports.savePilot = async (req, res)=>{
    const user = req.user._id;
    const { pilotId, folderId } =
    req.body;
  const _industry = new savePilotModel({
  userId : user,
  pilotId,
  folderId
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
}

exports.getSavedPilots = async (req, res)=>{
   const {folderId} = req.body
    savePilotModel.find({folderId: folderId}).populate("pilotId", "name pilotType city skills hourlyPayment monthlyPayment  profilePic keywordsVisible userName").exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.getMySavedPilots = async (req,res)=>{
  const user = req.user._id
    savePilotModel.find({userId: user}).distinct("pilotId").exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}


exports.unSavePilot = async (req, res)=>{
  const user = req.user._id
  savePilotModel.findOneAndDelete({userId: user, pilotId: req.body.pilotId}).exec((err, result)=>{
    if(err){
        res.send(err)
    }else{
        res.send(result)
    }
})
}