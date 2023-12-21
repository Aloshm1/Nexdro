const service_centerModel = require("../models/service_centerModel");
const Center = require("../models/service_centerModel");
const userModel = require("../models/userModel");


exports.createCenter =  (req, res) => {
    const { userId, centerName, email,phoneNo, whatsappNo, address, streetName, areaName, city, state, country,pinCode, workingHours, secondaryNumber, website, brandOfDrones, description, photos, rating} = req.body;
    
    const center = new Center({ userId, centerName, email,phoneNo, whatsappNo, address, streetName, areaName, city, state, country,pinCode, workingHours, secondaryNumber, website, brandOfDrones, description, photos, rating});
    center.save((error, data) => {
      if (error) {
        return res.send(error);
      }
      if (data) {
        return res.status(201).json({
          user: data,
        });
      }
    });
}

exports.getServiceCenter = async(req,res) =>{
  const page = parseInt(req.query.page)
      const limit = 14;
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await Center.countDocuments().exec()) {
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
  Center.find({}).sort({ $natural: -1 }).limit(limit).skip(startIndex).exec((err,result)=>{
      if(err){
          res.send(err)
      }
      else{
          results.results = result
          res.send(results)
      }
  })
}
exports.getServiceCenterWpn = async(req,res) =>{
  Center.find({}).select(['-phoneNo','-whatsappNo','-secondaryNumber']).exec((err,result)=>{
      if(err){
          res.send(err)
      }
      else{
          res.send(result)
      }
  })
}


exports.centerLanding = (req, res)=>{
  const id = req.params.id;
   service_centerModel.findById(id).exec((err,result)=>{
      if(err){
          res.send(err);
      }
      else{
        res.send(result)
      }
  });
}


exports.requestQuote = async (req, res) => {
  const user= req.user._id;
  try{
    const _user = await userModel.findOne({_id: user});
  
    res.status(200).json({
      name: _user.name,
      email: _user.email,
      phoneNo: _user.phoneNo
    })
      }catch(err){
        res.send("please Login")    
  }
};

exports.saveCenter = async(req,res) => {
 
    const id = req.params.id;
    const user = req.user._id;
  
    try {
  
      await userModel
        .findById(user)
        .updateOne({ $push: { markedCenters: id } });
        res.send("BookMarked Successfully");
    } catch (err) {
      res.send(err);
    }
  
}

exports.unsaveCenter = async(req,res) => {
 
  const id = req.params.id;
  const user = req.user._id;

  try {

    await userModel
      .findById(user)
      .updateOne({ $pull: { markedCenters: id } });
      res.send("UNBookMarked Successfully");
  } catch (err) {
    res.send(err);
  }

}

exports.filterCenter = async (req, res)=>{
 
  
    let data1 = req.body.brands
    regex1 = data1.join("|");
    const page = parseInt(req.query.page)
    const limit = 14;

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await service_centerModel.find({ "address" : { $regex: req.body.address, $options: 'i' } , "brandOfDrones" : { $regex: regex1, $options: 'i' }}).countDocuments().exec()) {
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


  await service_centerModel.find({ "address" : { $regex: req.body.address, $options: 'i' } , "brandOfDrones" : { $regex: regex1, $options: 'i' }}).limit(limit).skip(startIndex).sort({ $natural: -1 }).exec((err, result)=>{
    if(err){
      res.send(err)
    }else{
      results.results = result
      res.send(results)
    }
  })
}


exports.filterDrones = async (req, res)=>{
  let data = ["brand1", "test"]
  regex = data.join("|");
  await service_centerModel.find({ "brandOfDrones" : { $regex: regex, $options: 'i' }}).exec((err, result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}

exports.getCenterData = async (req, res)=>{
  let user = req.user._id;
  await service_centerModel.findOne({userId: user}).exec((err, result1)=>{
    if(err){
      res.send(err)
    }else{
      res.json({
        "userName": req.user.name,
        "userEmail": req.user.email,
        "userPhoneNo": req.user.phoneNo,
        "centerData": result1
      })
    }
  })
}

exports.getIdbySlug = async (req,res)=>{
  service_centerModel.find({slug:req.params.slug}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      if(result.length == 0){
        res.json({id: "noData"})
      }else{
        res.json({id: result[0]._id})
      }
      
    }
  })
}