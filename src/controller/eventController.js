const eventModel = require("../models/eventsModel")
const AWS = require("aws-sdk");
const crypto = require("crypto");
const sharp = require('sharp')
let ext = crypto.randomBytes(32).toString("hex");
exports.createEvent = async (req,res)=>{
    console.log(req.body.file)
      const {image, title, category, metaTitle, metaKeywords, metaDescription, slug, location, description, date} =
      req.body;
      const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ID,
          secretAccessKey: process.env.AWS_SECRET,
        });
        const resized =  sharp(req.file.buffer)
        .resize({
            width: 770,
        })
        .toBuffer()
        .then( data => {
        let myFile = req.file.originalname.split(".");
        const fileType = myFile[myFile.length - 1];
    
        // let buffer = data;
    
        const params1 = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `blog/${myFile[0] + ext}.${fileType}`,
          Body: data,
        };
    
        s3.upload(params1, async (error, data) => {
          if (error) {
            res.status(500).send(error);
          }
    
    const _industry = new eventModel({
     image, title, category, metaTitle, metaKeywords, metaDescription, slug, location, description, date, image: data.Key
    });
    try {
      const a1 = await _industry.save();
      res.json(a1);
    } catch (err) {
      res.status(400).send(err);
    }
  })
        })
  }



  exports.getAllEvents = async(req,res)=>{
    const page = parseInt(req.query.page)
    const limit = 10;
  
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
  
    const results = {}
  
    if (endIndex < await eventModel.find().countDocuments().exec()) {
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
  
      await eventModel.find().skip(startIndex).limit(limit).sort({createdAt : -1}).exec((err, result)=>{
          if(err){
              res.send(err)
          }else{
            results.results = result
              res.send(results)
          }
      })
  }


  exports.getEvent = async (req,res)=>{
    eventModel.findOne({_id: req.params.id}).exec((err,result)=>{
      if(err){
        res.send(err)
      }else{
        res.send(result)
      }
    })
  }

  exports.eventDetails = async (req,res)=>{
    eventModel.findOne({slug: req.params.slug}).exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
  }

  exports.getEventsTrending = async(req,res)=>{
    await eventModel.find({}).limit(6).sort({views : -1}).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}