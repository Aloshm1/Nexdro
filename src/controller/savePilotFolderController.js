const savePilotFolderModel = require("../models/savePilotFolderModel");
const { savePilot } = require("./pilotController");

exports.createFolder = async (req, res) => {
    const user = req.user._id;
    const { folderName, description } =
      req.body;
    const _industry = new savePilotFolderModel({ userId: user,
    folderName, description
    });
    try {
      const a1 = await _industry.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
  };

  exports.getMyFolders = async (req, res)=>{
      const user = req.user._id;
      await savePilotFolderModel.find({userId: user}).sort({ createdAt: -1 }).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
  }

  exports.getFolderData = async (req, res)=>{
    const folderId = req.body.folderId;
    await savePilotFolderModel.findOne({_id : folderId}).exec((err, result)=>{
      if(err){
          res.send(err)
      }else{
          res.send(result)
      }
  })
  }

  exports.deleteFolder = async (req,res)=>{
    const folderId = req.body.folderId;
    await savePilotFolderModel.findByIdAndDelete(folderId).exec((err,result)=>{
      if(err){
        res.send(err)
      }else{
        res.send(result)
      }
    })
  }
  exports.getFolderDetails = async (req,res)=>{
    const folderId = req.body.folderId;
    await savePilotFolderModel.findOne({_id : folderId}).exec((err,result)=>{
      if(err){
        res.send(err)
      }else{
        res.send(result)
      }

    })
  }

  exports.updateFolderData = async (req,res)=>{
    const {folderId, folderName, description} = req.body;
    await savePilotFolderModel.findOne({_id : folderId}).update({folderName, description}).exec((err,result)=>{
      if(err){
        res.send(err)
      }else{
        res.send(result)
      }
    })
  }