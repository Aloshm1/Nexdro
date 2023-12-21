const imageModel = require('../models/imageModel')
exports.getRecommended = async (req,res)=>{
    await imageModel.find({recommended: true}).sort({createdAt: -1}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.removeRecommmended = async (req,res)=>{
    const id = req.params.id;
    imageModel.findOne({_id: id}).updateOne({recommended: false}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.addRecommmended = async (req,res)=>{
    const id = req.params.id;
    imageModel.findOne({_id: id}).updateOne({recommended: true}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.getImagesofRecommended = async (req,res)=>{
    const {type} = req.body;
    if(type=="all"){
        await imageModel.find({recommended: false}).sort({createdAt: -1}).limit(20).exec((err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send(result)
            }
        })
    }
    else if(type ==  "views"){
        await imageModel.find({recommended: false}).sort({views: -1}).limit(20).exec((err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send(result)
            }
        })
    }
    else if(type ==  "downloads"){
        await imageModel.find({recommended: false}).sort({downloadCount: -1}).limit(20).exec((err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send(result)
            }
        })
    }
    else if(type ==  "comments"){
        await imageModel.find({recommended: false}).sort({commentCount: -1}).limit(20).exec((err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send(result)
            }
        })
    }
    else if(type ==  "likes"){
        await imageModel.find({recommended: false}).sort({likedCount: -1}).limit(20).exec((err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send(result)
            }
        })
    }else{
        res.send("No Proper Type")
    }
}