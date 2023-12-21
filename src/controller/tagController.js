const imageModel = require("../models/imageModel");
const tagModel = require("../models/tagModel");

exports.createTag = async (req, res)=>{
    const { tag, metaTitle, metaKeywords, metaDescription, slug } =
    req.body;
  const _industry = new tagModel({
    tag, metaTitle, metaKeywords, metaDescription, slug
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.status(400).send("error");
  }}

  exports.getTags = async (req,res)=>{
      tagModel.find({}).sort({createdAt :-1}).exec((err, result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }

  exports.imageFilters = async (req, res)=>{

    tagModel.findOne({slug: req.body.data}).exec(async (err,result)=>{
      if(err){
        res.send(err)
      }else{
        
        const type = req.body.type;
        if(type === "all"){
          var re = new RegExp(result.tag, 'i');

          //pagination

          const page = parseInt(req.query.page)
        const limit = 15;
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
    
        if (endIndex < await imageModel.find({status: "active"}).or([{ 'keywords': { $regex: re }}, { 'category': { $regex: re }}]).countDocuments().exec()) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
      
          
          imageModel.find({status: "active"}).or([{ 'keywords': { $regex: re }}, { 'category': { $regex: re }}]).skip(startIndex).limit(limit).sort({ createdAt: -1 })
          .exec((err, result) => {
            if (err) {
              res.send(err);
            } else {
              results.results = result
              res.send(results);
            }
          }
          )
        }else{
    
          var re = new RegExp(result.tag, 'i');
          const page = parseInt(req.query.page)
        const limit = 15;
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
    
        if (endIndex < await imageModel.find({status: "active"}).or([{ 'keywords': { $regex: re }}, { 'category': { $regex: re }}]).countDocuments().exec()) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
    
        imageModel.find({fileType: type, status:"active"}).or([{ 'keywords': { $regex: re }}, { 'postName': { $regex: re }}]).skip(startIndex).limit(limit).sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result
              res.send(results);
          }
        }
        )
      
      }
      }
    })
    }


    exports.deleteTag = async (req,res)=>{
      await tagModel.findByIdAndDelete(req.body.id).exec((err,result)=>{
        if(err){
          res.send(err)
        }else{
          res.send(result)
        }
      })
    }
exports.getTag = async (req,res)=>{
tagModel.findOne({_id: req.params.id}).exec((err,result)=>{
  if(err){
    res.send(err)
  }else{
    res.send(result)
  }
})
}
    exports.editPost = async(req,res)=>{
      const { tag, metaTitle, metaKeywords, metaDescription, slug , id} =
    req.body;
    tagModel.findOne({_id: id}).update({ tag, metaTitle, metaKeywords, metaDescription, slug}).exec((err,result)=>{
      if(result){
        res.send(result)
      }else{
        res.status(400).send(err)

        console.log(err)
      }
    })
    }


    exports.getTagData = async(req,res)=>{
      await tagModel.findOne({slug : req.params.slug}).exec((err,result)=>{
        if(err){
          res.send(err)
        }else{
          res.send(result)
        }
      })
    }