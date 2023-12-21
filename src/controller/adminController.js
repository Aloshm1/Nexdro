const companyModel = require("../models/companyModel.js");
const imageModel = require("../models/imageModel.js");
const Jobs = require("../models/jobModel.js");
const pilotModel = require("../models/pilotModel.js");
const service_centerModel = require("../models/service_centerModel.js");
const userModel = require("../models/userModel.js");
const User = require("../models/userModel.js");
const sendMailVerify = require("../../utils/sendMail.js");


exports.getPendingJobs = async (req, res) => {
  Jobs.find({ status: "pending" })
    .sort({ updatedAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getActiveJobs = async (req, res) => {
    Jobs.find({ status: "active" })
      .sort({ updatedAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  };

exports.approveJob = async (req, res) => {
  // const newAge = req.body.newAge;
  const id = req.params.id;
  // const user= req.user._id;

  try {
    let job = await Jobs.findById(id).updateOne({ status: "active" });
    res.send(job)
  } catch (err) {
    res.send("please Login");
  }
};

exports.pendingJob = async (req, res) => {
  // const newAge = req.body.newAge;
  const id = req.params.id;
  // const user= req.user._id;

  try {
    let job = await Jobs.findById(id).updateOne({ status: "pending" });
    res.send(job)
  } catch (err) {
    res.send("please Login");
  }
};


exports.getImages = async (req, res) => {

  imageModel.find({ status: "pending" })
    .sort({ updatedAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getApprovedImages = async (req, res) => {

  imageModel.find({ status: "active" })
    .sort({ updatedAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.getRejectedImages = async (req, res) => {

  imageModel.find({ status: "rejected" })
    .sort({ updatedAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.approveImage = async (req, res) => {


  // const newAge = req.body.newAge;
  const id = req.params.id;
  // const user= req.user._id;

  try {
    let job = await imageModel.findById(id).updateOne({ status: "active" });
let image = imageModel.findById(id).exec((err, result) => {
  if (err) {
    console.log(err);
  } else {
    // res.send(result);
    //rearranged files
    userModel.findOne({userId: result.userId}).exec((err,result1)=>{
      if(result.fileType === "video"){
        pilotModel.findOne({userId: result.userId}).exec((err,result2)=>{
          if(result2.rearrangedVideos.length !== 0){
            let r1 = result2.rearrangedVideos.concat(result)
            pilotModel.findOne({userId: result.userId}).update({rearrangedVideos: r1}).exec((err,result3)=>{
              if(err){
                console.log(err)
              }else{
                console.log(result3)
              }
            })
          }
        })
      }
      else if(result.fileType === "image"){
        pilotModel.findOne({userId: result.userId}).exec((err,result2)=>{
          if(result2.rearrangedImages.length !== 0){
            let r1 = result2.rearrangedImages.concat(result)
            pilotModel.findOne({userId: result.userId}).update({rearrangedImages: r1}).exec((err,result3)=>{
              if(err){
                console.log(err)
              }else{
                console.log(result3)
              }
            })
          }
        })
      }else if(result.fileType === "3d"){
        pilotModel.findOne({userId: result.userId}).exec((err,result2)=>{
          if(result2.rearranged3d.length !== 0){
            let r1 = result2.rearranged3d.concat(result)
            pilotModel.findOne({userId: result.userId}).update({rearranged3d: r1}).exec((err,result3)=>{
              if(err){
                console.log(err)
              }else{
                console.log(result3)
              }
            })
          }
        })
      }
    })
    // console.log(result)
    let image = userModel.findById(result.userId).exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        // res.send(result);
        let message = `Greetings from Drone
    
The Image recently uploaded by you has been successfully approved. Check your dashboard to track downloads and likes.
        
Thank You,
Team Nexdro
            `;
        
             sendMailVerify(result.email, "Image Approved | Nexdro", message);      }
    })
  }
})

    res.send(job)
  } catch (err) {
    res.send("please Login");
  }
};

exports.putPendingImage = async (req, res) => {
  // const newAge = req.body.newAge;
  const id = req.params.id;
  // const user= req.user._id;

  try {
    let job = await imageModel.findById(id).updateOne({ status: "pending" });
    res.send(job)
  } catch (err) {
    res.send("please Login");
  }
};
exports.rejectImage = async (req, res) => {
  const rejectReason = req.body.rejectReason;
  const id = req.params.id;
  // const user= req.user._id;

  try {
    let job = await imageModel.findById(id).updateOne({ status: "rejected", rejectReason: rejectReason });
    let image = imageModel.findById(id).exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        // res.send(result);
        // console.log(result)
        let image = userModel.findById(result.userId).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            // res.send(result);
            let message = `Greetings from Drone
        
The Image recently uploaded by you has been rejected. 

Reject Reason: ${req.body.rejectReason}

Check your dashboard for more details.
            
Thank You,
Team Nexdro
                `;
            
                 sendMailVerify(result.email, "Image Rejected | Nexdro", message);      }
        })
      }
    })
    res.send(job)
  } catch (err) {
    res.send("please Login");
  }
};

exports.getNumberofAll = async (req, res) => {

  let images = await imageModel.find({ });
  let users = await userModel.find({ });
  let pilots = await pilotModel.find({ });
  let companies = await companyModel.find({ });
  let service_centers = await service_centerModel.find({ });
  res.send(
    {
      images: images,
      users,
      pilots,
      companies,
      service_centers
    }
  )

};