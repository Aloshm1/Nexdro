const seoModel = require("../models/seoModel");

exports.createSeo = async (req,res) =>{
    const { title, metaTitle, metaKeywords, metaDescription, pageName } =
    req.body;
  const factor = new seoModel({
    title, metaTitle, metaKeywords, metaDescription, pageName
  });
  try {
    const a1 = await factor.save();
    res.json(a1);
  } catch (err) {
    res.status(400).send("error");
  }
}

exports.getSeo = async (req,res)=>{
    seoModel.findOne({pageName: req.params.page}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}
exports.getAllSeo = async (req,res)=>{
    seoModel.find().sort({createdAt : -1}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}
exports.editSeo = async (req,res)=>{
    const { title, metaTitle, metaKeywords, metaDescription, pageName } =
    req.body;
    seoModel.findOne({pageName}).update({
        title, metaTitle, metaKeywords, metaDescription
    }).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}