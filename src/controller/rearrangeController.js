const rearrangeModel = require("../models/rearrangeModel")
const pilotModel = require("../models/pilotModel")
exports.createRearrange = async (req,res) =>{
    console.log(req.body,'rearrange')
    const user = req.user._id;
    const _rearrange = new rearrangeModel({
        userId: req.user._id,
        media: req.body.media,
        fileType: req.body.fileType
      });
      try {
        const a1 = await _rearrange.save();
        res.json(a1);
      } catch (err) {
        res.send("error");
      }
}

exports.getRearrangedMedia = async (req,res)=>{
    const user = req.user._id;
    rearrangeModel.find({userId: user, fileType: req.body.fileType}).populate("media").exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            if(result.length == 0){
                res.send("No file available")
            }else{
                res.send(result)
            }
        }
    })
}

exports.updateRearrangeFiles = async (req,res) =>{
    console.log(req.body,'rearrange')
    const user = req.user._id
    
    rearrangeModel.findOne({userId:user, fileType: req.body.fileType}).updateOne({media: req.body.media}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.getUserRearrange = async (req,res)=>{
    let userName = req.params.userName;
    pilotModel.find({userName}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            if(result.length !== 0){
                rearrangeModel.findOne({userId: result[0].userId, fileType: req.body.fileType}).populate("media").exec((err,result)=>{
                    if(err){
                        res.send(err)
                    }else{
                        if(result){
                            res.send(result)
                        }else{
                            res.send("No media")
                        }
                        console.log(result)
                        
                    }
                })
            }
        }
    })
}