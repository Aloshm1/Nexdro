const faqModel = require("../models/faqModel");

exports.createFaq = async (req, res)=>{
    const { query, answer } =
    req.body;
  const _industry = new faqModel({
 query, answer
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
}

exports.getFaqs = async(req, res)=>{
    await faqModel.find().sort({createdAt : -1}).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.searchFaqs = async(req, res)=>{
    const re = req.body.keyword
    await faqModel.find({}).or([{ 'query': { $regex: re, $options: "i"}}, { 'answer': { $regex: re, $options: "i"}}]).sort({ createdAt: -1 }).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}