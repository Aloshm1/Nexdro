const categoryModel = require("../models/categoryModel");

exports.createCategory = async (req, res)=>{
    const { category, metaTitle, metaKeywords, metaDescription, slug } =
    req.body;
  const _industry = new categoryModel({
    category, metaTitle, metaKeywords, metaDescription, slug
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }}

  exports.getCategories = async(req,res)=>{
      await categoryModel.find({}).sort({createdAt: -1}).limit(5).exec((err,result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }
  exports.getOneCategory = async(req,res)=>{
      await categoryModel.findOne({slug: req.params.slug}).exec((err,result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }

  exports.getAllCategories = async (req,res)=>{
      await categoryModel.find({}).sort({createdAt: -1}).exec((err,result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }

  exports.getOnlyCategories = async (req,res)=>{
      await categoryModel.find({}).sort({createdAt: -1}).distinct("category").exec((err,result)=>{
          if(result){
              res.send(result)
          }
      })
  }

  exports.deleteCategory = async(req,res)=>{
      await categoryModel.findByIdAndDelete(req.body.id).exec((err,result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }