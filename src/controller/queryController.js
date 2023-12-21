const queriesModel = require("../models/queriesModel");

exports.createQuery = async(req, res)=>{
    const User = req.user._id;
    console.log(req.body)
    const { name, emailId, query, description } = req.body;
    const _industry = new queriesModel({
        userId: User, name, emailId, query, description
    });
    try {
      const a1 = await _industry.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
  }

  exports.getQueries = async (req, res)=>{
      const User = req. user._id;
      queriesModel.find({userId: User}).sort({updatedAt: -1}).exec((err, result)=>{
          if(err){
              res.send(err)
          }else{
              res.send(result)
          }
      })
  }
  exports.getAllQueries = async (req, res)=>{
    queriesModel.find({status: "pending"}).sort({updatedAt: -1}).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}
exports.answerQuery = async(req,res)=>{
    const {answer, id} = req.body
    queriesModel.findOne({_id: id}).update({answer: answer, status: "resolved"}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}