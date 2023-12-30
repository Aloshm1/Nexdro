const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const crypto = require("crypto");
let brandsModel = require("../models/brandsModel")
let ext = crypto.randomBytes(16).toString("hex");
const mailSend = require("../../utils/mailSend")
var AWS = require("aws-sdk");
const {
  createCenter,
  getServiceCenter,
  getServiceCenterWpn,
  centerLanding,
  requestQuote,
  saveCenter,
  unsaveCenter,
  filterCenter,
  filterDrones,
  getCenterData,
  getIdbySlug,
} = require("../controller/service_centerController");
const { protectPilot } = require("../middlewares/createPilot");
const { protect } = require("../middlewares/auth");
const service_centerModel = require("../models/service_centerModel");
const userModel = require("../models/userModel");
const router = express.Router();
var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});
var multipleUpload = multer({ storage: storage }).array("file");
var upload = multer({ storage: storage }).single("file");

router.post("/registerCenter", multipleUpload, createCenter);
router.get("/getCenter", getServiceCenter);
router.get("/centerLanding/:id", centerLanding);
router.get("/getCenterWpn", getServiceCenterWpn);
router.post("/requestQuote", protectPilot, requestQuote);
router.post("/filterCenter", filterCenter);
router.get("/filterDrones", filterDrones);

router.post("/saveCenter/:id", protect, saveCenter);
router.post("/unsaveCenter/:id", protect, unsaveCenter);
router.post("/getCenterData", protect, getCenterData);
router.get("/getIdbySlug/:slug", getIdbySlug)

router.post(
  "/createServiceCenter",
  protectPilot,
  multipleUpload,
  function (req, res) {
   
    const user = req.user._id;
    console.log(req.body,'ooo')
    
    const {
      centerName,
      email,
      phoneNo,
      whatsappNo,
      address,
      streetName,
      areaName,
      city,
      state,
      country,
      pinCode,
      workingHours,
      secondaryNumber,
      website,
      brandOfDrones,
      description,
      holidays,
      establishedYear,
      services
    } = req.body;

    let z = Math.floor(100000 + Math.random() * 900000);
    let r = `${z}-`
    let tempTitle = centerName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(" ").join("-")
    let slugtemp = r+tempTitle
    const file = req.files;
    const holidays1 = req.body.holidays.split(",");
    const brandOfDrones1 = req.body.brandOfDrones.split(",");
    const services1 = req.body.services.split(",");

    let s3bucket = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS,
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    

    s3bucket.createBucket(function () {
      //Where you want to store your file
      var ResponseData = [];

      file.map((item) => {
        let myFile = item.originalname.split(".");
    const fileType1 = myFile[myFile.length - 1];
        const resized = sharp(item.buffer)

          .toBuffer()
          .then((data) => {
            var params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `serviceCenter/${myFile[0] + ext}${fileType1}`,
              Body: data,
            };
            s3bucket.upload(params, function (err, data) {
              if (err) {
                res.json({ error: true, Message: err });
              } else {
                ResponseData.push(data.key);
                if (ResponseData.length == file.length) {
                  // res.json({ "error": false, "Message": "File Uploaded    SuceesFully", Data: ResponseData});

                  const center = new service_centerModel({
                    userId: user,
                    centerName,
                    email,
                    phoneNo,
                    whatsappNo,
                    address,
                    streetName,
                    areaName,
                    city,
                    state,
                    country,
                    pinCode,
                    workingHours,
                    secondaryNumber,
                    website,
                    brandOfDrones: brandOfDrones1,
                    description,
                    images: ResponseData,
                    holidays: holidays1,
                    establishedYear,
                    slug:slugtemp,
                    services: services1
                  });
                  center.save((error, data) => {
                    if (error) {
                      return res.send(error);
                    }
                    if (data) {
                      userModel
                        .findById(user)
                        .update({ role: "service_center" })
                        .exec((err, res) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(res);
                          }
                        });
                      return res.status(201).send({
                        data,
                      });
                    }
                  });
                }
              }
            });
          });
      });
    });
    var mailOptions = {
      from: 'alosh.nexevo@gmail.com',
      to: req.user.email,
      subject: 'Welcome to Nexdro Pilot Network',
      template: 'center',
      context: {
       centerName: req.body.centerName,
       slug: slugtemp,
       profilePic: req.user.profilePic,
       country: req.user.country,
       feUrl: process.env.BASE_URL
      }
    
    };
     mailSend(mailOptions)
    for(let i=0; i< brandOfDrones1.length ;i++){
      var re = new RegExp(brandOfDrones1[i], "i");
      console.log(re)
      brandsModel.find({brand: re}).exec(async(err,result)=>{
        if(err){
          console.log(err)
        }else{
          if(result.length == 0){
            function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            }
            let temp = capitalizeFirstLetter(brandOfDrones1[i])
            const _industry = new brandsModel({
              brand: temp
              });
              try {
                const a1 = await _industry.save();
                console.log(a1)
              } catch (err) {
                console.log(err)
              }
          }else{
            console.log(result)
          }
         
        }
      })
    }
  }
);

router.post("/updateData", protectPilot, multipleUpload, function (req, res) {
  console.log(req.files);
  console.log(req.body.oldImages);
  const user = req.user._id;
  const {
    userName,
    userEmail,
    userPhone,
    centerName,
    email,
    phoneNo,
    whatsappNo,
    address,
    streetName,
    areaName,
    city,
    state,
    country,
    pinCode,
    workingHours,
    secondaryNumber,
    website,
    brandOfDrones,
    description,
    holidays,
    establishedYear,
    oldImages,
  } = req.body;
  let z = Math.floor(100000 + Math.random() * 900000);
  let r = `${z}-`
  let tempTitle = centerName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(" ").join("-")
  let slugtemp = r+tempTitle
  if (req.user.email !== userEmail) {
    userModel
      .findOne({ _id: user })
      .update({ verify: false })
      .exec((err, result) => {
        console.log(result);
      });
  }
  const file = req.files;
  const holidays1 = req.body.holidays.split(",");
  const brandOfDrones1 = req.body.brandOfDrones.split(",");
  const oldImages1 = req.body.oldImages.split(",");
  
  if (req.files.length === 0) {
    service_centerModel
      .findOne({ userId: user })
      .update({
        centerName,
        email,
        phoneNo,
        whatsappNo,
        address,
        streetName,
        workingHours,
        secondaryNumber,
        website,
        brandOfDrones: brandOfDrones1,
        description,
        holidays: holidays1,
        establishedYear,
        images: oldImages1,
        slug: slugtemp
      })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          userModel
            .findById(user)
            .update({ name: userName, email: userEmail, phoneNo: userPhone })
            .exec((err, result) => {
              if (err) {
                res.send(err);
              } else {
                res.send("All Updated");
              }
            });
        }
      });
  } else {
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS,
      Bucket: "nexdro",
    });

    s3bucket.createBucket(function () {
      console.log(oldImages1);
      //Where you want to store your file
      var ResponseData = oldImages1;

      file.map((item) => {
        let myFile = item.originalname.split(".");
        const fileType1 = myFile[myFile.length - 1];
        const resized = sharp(item.buffer)
          .resize({
            width: 600,
            height: 600,
          })
          .toBuffer()
          .then((data) => {
            var params = {
              Bucket: "nexdro",
              Key: `serviceCenter/${myFile[0] + ext}${fileType1}`,
              Body: data,
            };
            s3bucket.upload(params, function (err, data) {
              if (err) {
                console.log({ error: true, Message: err });
              } else {
                ResponseData.push(data.key);
                service_centerModel
                  .findOne({ userId: user })
                  .update({
                    centerName,
                    email,
                    phoneNo,
                    whatsappNo,
                    address,
                    streetName,
                    workingHours,
                    secondaryNumber,
                    website,
                    brandOfDrones: brandOfDrones1,
                    description,
                    holidays: holidays1,
                    establishedYear,
                    images: ResponseData,
                    slug:slugtemp
                  })
                  .exec((err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      userModel
                        .findById(user)
                        .update({
                          name: userName,
                          email: userEmail,
                          phoneNo: userPhone,
                        })
                        .exec((err, result) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("All Updated");
                          }
                        });
                    }
                  });
              }
            });
          });
      });
    });
    res.send("All Updated");
  }
});

module.exports = router;
