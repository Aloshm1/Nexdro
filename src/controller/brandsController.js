const brandsModel = require("../models/brandsModel");

exports.createBrand = async (req, res) => {
    const { brand } =
      req.body;
    const _industry = new brandsModel({
    brand
    });
    try {
      const a1 = await _industry.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
  };
  
  exports.getBrands = async (req, res) => {
    console.log('iopgopidiopgfdodfoipfofgoi')
    brandsModel.find({ }).select("brand")
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  };
  exports.getBrands1 = async (req, res) => {
    brandsModel.find({ }).distinct("brand")
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  };

  exports.deleteBrand = async (req, res) => {
    let id = req.params.id;
  brandsModel.deleteOne({_id :id })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

  exports.getOnlyBrands = async (req,res)=>{
    console.log('resultesdfd')
    brandsModel.find({}).distinct("brand").exec((err,result)=>{
      if(err){
        res.send(err)
      }else{
        res.send(result)
        console.log(result,'ooopspsp')
      }
    })
  }