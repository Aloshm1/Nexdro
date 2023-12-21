const draftImageModel = require("../models/draftImageModel");
const imageModel = require("../models/imageModel");
const userModel = require("../models/userModel");
const crypto = require("crypto");

const AWS = require("aws-sdk");
const sharp = require("sharp");
const Svg = require("./watermark");
const pilotModel = require("../models/pilotModel");
const rearrangeModel = require("../models/rearrangeModel");
let ext = crypto.randomBytes(32).toString("hex");
exports.createDraft1 = async (req, res) => {
  const user = req.user._id;
  const profilePic = req.user.profilePic;
  const keywords1 = req.body.keywords.split(",");
  //get month and year
  let arr = ["b", "i", "n", "o", "c", "u", "l", "a", "r", "s"];
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  year = String(year);
  let newYear = `${arr[Number(year[0])]}${arr[Number(year[1])]}${
    arr[Number(year[2])]
  }${arr[Number(year[3])]}`;
  let newMonth = ("0" + (month + 1)).slice(-2);
  let thisMonth = `${arr[Number(newMonth[0])]}${arr[Number(newMonth[1])]}`;
  //getting month and year

  const {
    postName,
    fileType,
    category,
    experience,
    keywords,
    rejectReason,
    adult,
  } = req.body;
  console.log(req.body.fileType);

  // res.send("It is a video")
  let z = Math.floor(1000 + Math.random() * 9000);
  let r = `${z}-`;
  let tempTitle = postName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;
  let myFile = req.file.originalname.split(".");
  const fileType1 = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${newYear}/${thisMonth}/${myFile[0] + ext}${
      fileType == "video" ? `.${fileType1}` : ".jpg"
    }`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    const image = new draftImageModel({
      userId: user,
      name: req.user.name,
      postName,
      fileType: req.body.fileType,
      category,
      file: data.Key,
      experience,
      keywords: keywords1,
      adult,
      rejectReason,
      slug: slugtemp,
    });
    try {
      const a1 = image.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }

    // res.status(200).send(data)
  });
};

exports.getDrafts = async (req, res) => {
  const user = req.user._id;

  draftImageModel
    .find({ userId: user })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.uploadDraft = async (req, res) => {
  console.log(req.body);
  const userId = req.user._id;

  const {
    postName,
    fileType,
    category,
    file,
    experience,
    keywords,
    adult,
    draftId,
  } = req.body;
  let z = Math.floor(1000 + Math.random() * 9000);
  let r = `${z}-`;
  let tempTitle = postName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;
  const image = new imageModel({
    name: req.user.name,
    profilePic: req.user.profilePic,
    userId: userId,
    postName,
    fileType,
    category,
    file,
    experience,
    keywords,
    adult,
    status: "active",
    slug: slugtemp,
  });
  image.save((error, data) => {
    if (error) {
      return res.send(error);
    }
    if (data) {
      console.log(data)
      rearrangeModel.find({userId: req.user._id, fileType: data.fileType}).exec((err,result)=>{
        if(err){
          console.log(err)
        }else{
          if(result.length !== 0){
            let arr = result[0].media;
            arr.push(data._id)
            rearrangeModel.findOne({userId: result[0].userId, fileType: result[0].fileType}).updateOne({media: arr}).exec((err,result)=>{
              if(err){
                console.log(err)
              }else{
               console.log(result)

              }
            })
          }
        }
      })
      return res.status(201).send(data);
    }
    draftImageModel.findOneAndRemove({ _id: draftId }).exec((err, result) => {
      if (err) {
        // res.send(err);
      } else {
        console.log(result);
      }
    });
  });
};

exports.deleteDraft = async (req, res) => {
  let id = req.body.id;
  console.log(id);
  await draftImageModel.findOneAndRemove({ _id: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
};
