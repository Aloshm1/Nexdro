const shootModel = require("../models/shootModel.js");
const imageModel = require("../models/imageModel.js");

exports.createShoot = async (req,res)=>{
    const { imageId, pilotId, place } =
    req.body;
  const _industry = new shootModel({
    imageId, pilotId, place
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
}


exports.getShoots = async (req,res)=>{
    shootModel.find({}).sort({place: 1}).populate("imageId", "file _id likes downloads views slug").populate("pilotId", "_id name profilePic").exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.setPlace = async (req,res)=>{
    const {imageId, place} = req.body;
    imageModel.findOne({_id: imageId}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
           shootModel.findOne({place: place}).update({imageId: imageId, pilotId: result.userId}).exec((err,result)=>{
               if(err){
                   res.send(err)
               }else{
                   res.send(result)
               }
           })    
        }
    })
}