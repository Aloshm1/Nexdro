const imageModel = require("../models/imageModel.js");
const pilotModel = require("../models/pilotModel.js");
const Pilot = require("../models/pilotModel.js");
const userModel = require("../models/userModel.js");
const skillsModel = require("../models/skillsModel")
const followModel = require("../models/followModel")
const crypto = require("crypto");
const { ObjectId } = require('mongodb')
const multer = require("multer");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const mailSend = require("../../utils/mailSend")
const Svg = require("./watermark");
const jobApplicationModel = require("../models/jobApplicationModel.js");
const jobModel = require("../models/jobModel.js");
const activityModel = require("../models/activityModel.js");
const brandsModel = require("../models/brandsModel.js");
let ext = crypto.randomBytes(32).toString("hex");

exports.createpilot = async (req, res) => {
  const data1 = req.body.industry.split(",");
  const dataSkill = req.body.skills.split(",");
  const drones1 = req.body.drones.split(",");

  if (req.file) {
    const {
      dob,
      gender,
      address,
      city,
      postalAddress,
      bio,
      pilotType,
      droneId,

      workType,
      hourlyPayment,
      monthlyPayment,
      industry,
      trainingCenter,
      completedYear,
      skills,
      rating,
      userName,
      preferredLocation,
      status,
      monthlyExperience,
      yearlyExperience,
      licenseNo
    } = req.body;
    const userId = req.user._id;
    const User = await userModel.findOne({ _id: userId });

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });

    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    // let buffer = data;

    const params1 = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `pilotCertificates/${myFile[0] + ext}.${fileType}`,
      Body: req.file.buffer,
    };

    s3.upload(params1, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }

      const pilotName = User.name;
      const pilotemail = User.email;
      const pilotPhone = User.phoneNo;
      const pilot = new Pilot({
        userId,
        name: pilotName,
        emailId: pilotemail,
        phoneNo: pilotPhone,
        country: User.country,
        dob,
        gender,
        address,
        city,
        postalAddress,
        bio,
        pilotType,
        certificates: data.key,
        droneId,
        droneType: drones1,
        workType,
        hourlyPayment,
        monthlyPayment,
        industry: data1,
        trainingCenter,
        completedYear,
        skills: dataSkill,
        rating,
        userName,
        preferredLocation,
        status,
        monthlyExperience,
        yearlyExperience,
        licenseNo
      });
      pilot.save(async (error, data) => {
        if (error) {
          return res.send(error);
        }
        if (data) {
          await userModel.findById(userId).updateOne({ role: "pilot" });
         
          return res.status(201).json({
            user: data,
          });
        }
      });
    });
  } else {
    const {
      dob,
      gender,
      address,
      city,
      postalAddress,
      bio,
      pilotType,
      droneId,
      droneType,
      workType,
      hourlyPayment,
      monthlyPayment,
      industry,
      trainingCenter,
      completedYear,
      skills,
      rating,
      userName,
      preferredLocation,
      status,
      monthlyExperience,
      yearlyExperience,
      licenseNo
    } = req.body;
    const userId = req.user._id;
    const User = await userModel.findOne({ _id: userId });

    const pilotName = User.name;
    const pilotemail = User.email;
    const pilotPhone = User.phoneNo;
    const pilot = new Pilot({
      userId,
      name: pilotName,
      emailId: pilotemail,
      phoneNo: pilotPhone,
      country: User.country,
      dob,
      gender,
      address,
      city,
      postalAddress,
      bio,
      pilotType,
      droneId,
      droneType: drones1,
      workType,
      hourlyPayment,
      monthlyPayment,
      industry: data1,
      trainingCenter,
      completedYear,
      skills: dataSkill,
      rating,
      userName,
      preferredLocation,
      status,
      monthlyExperience,
      yearlyExperience,
      licenseNo
    });
    pilot.save(async (error, data) => {
      if (error) {
        return res.send(error);
      }
      if (data) {
        await userModel.findById(userId).updateOne({ role: "pilot" });

        return res.status(201).json({
          user: data,
        });
      }
    });
  }
  for(let i=0; i< drones1.length ;i++){
    var re = new RegExp(drones1[i], "i");
    console.log(re)
    brandsModel.find({brand: re}).exec(async(err,result)=>{
      if(err){
        console.log(err)
      }else{
        if(result.length == 0){
          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          let temp = capitalizeFirstLetter(drones1[i])
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
  for(let i=0; i< dataSkill.length ;i++){
    var re = new RegExp(dataSkill[i], "i");
    console.log(re)
    skillsModel.find({skill: re}).exec(async(err,result)=>{
      if(err){
        console.log(err)
      }else{
        if(result.length == 0){
          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          let temp = capitalizeFirstLetter(dataSkill[i])
          const _industry = new skillsModel({
            skill: temp
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
  var mailOptions = {
    from: 'alosh.nexevo@gmail.com',
    to: req.user.email,
    subject: 'Welcome to Nexdro Pilot Network',
    template: 'pilot',
    context: {
    name: req.user.name,
    feUrl: process.env.BASE_URL,
    userName: req.body.userName,
    profilePic: req.user.profilePic,
    city: req.body.city
    }
  
  };
  await mailSend(mailOptions)
};

exports.getPilots = async (req, res) => {
  Pilot.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.hirePilots = async (req, res) => {
  Pilot.findOne({ status: true })
    .sort({ rating: 1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(res.paginatedResults1);
      }
    });
};

exports.hirePilotsFilters = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 3;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await Pilot.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  try {
    // filtering
    const pilotType = req.query.pilotType;
    const workType = req.query.workType;
    const droneType = req.query.droneType;
    const rating = req.query.rating;
    const city = req.query.city;
    const country = req.query.country;
    const minSalary = parseInt(req.query.minSalary);
    const maxSalary = parseInt(req.query.maxSalary);
    const hourlyPayment = { $range: [minSalary, maxSalary] };
    const data = {};
    data.status = true;
    if (pilotType) {
      data.pilotType = pilotType;
    }
    if (workType) {
      data.workType = workType;
    }
    if (droneType) {
      data.droneType = droneType;
    }
    if (rating) {
      data.rating = rating;
    }
    if (city) {
      data.city = city;
    }
    if (country) {
      data.country = country;
    }
    if (minSalary && maxSalary) {
      data.hourlyPayment = hourlyPayment;
      // hourlyPayment =  {$range: [ minSalary, maxSalary ] }
    }
    results.results = await Pilot.find(data)
      .populate("userId")
      .sort({ rating: -1 })
      .limit(limit)
      .skip(startIndex)
      .exec();
    res.paginatedResults1 = results;
    // console.log(results[2].userId.name)

    res.send(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.appliedJobs = async (req, res) => {
  let pilot = await pilotModel.findOne({ userId: req.user._id });

  Pilot.findById(pilot._id)
    .populate("appliedJobs")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result.appliedJobs);
      }
    });
};

exports.savedJobs = async (req, res) => {
  let pilot = await pilotModel.findOne({ userId: req.user._id });

  const pilotId = req.user.roleId;

  Pilot.findById(pilot._id)
  .populate({
    path: 'savedJobs',
    model: 'jobs',
    populate: {
      path: 'companyId',
      model: 'companies'
    }
  })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result.savedJobs);
      }
    });
};

exports.hiredJobs = async (req, res) => {
  const pilotId = req.user.roleId;

  Pilot.findById(pilotId)
    .populate("hiredJobs")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result.hiredJobs);
      }
    });
};

exports.likedJobs = async (req, res) => {
  const user = req.user._id;
  try {
    const pilot = await pilotModel.findOne({ userId: user });

    res.send(pilot.savedJobs);
  } catch (err) {
    res.send("please Login");
  }
};

exports.getaApliedJobs = async (req, res) => {
  const user = req.user._id;
  try {
    const pilot = await Pilot.findOne({ userId: user });

    res.send(pilot);
  } catch (err) {
    res.send("please Login");
  }
};

exports.singlePilot = async (req, res) => {
  const user = req.user._id;
  try {
    const pilot = await pilotModel.findOne({ userId: user });

    res.send(pilot);
  } catch (err) {
    res.send("please Login");
  }
};

exports.pilotLanding = (req, res) => {
  const id = String(req.params.id);
  
  pilotModel.findOne({ userName: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if(result == null){
        res.json({data:"noData"})
      }else{
        res.send(result);
      }
      
    }
  });
};

exports.savePilot = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  console.log(id, user);
  try {
    const pilot = await pilotModel.findOne({ userId: user });

    await pilotModel
      .findById(pilot._id)
      .updateOne({ $push: { savedJobs: id } });
    res.send("Liked Successfully");
  } catch (err) {
    res.send("please Login");
  }
};

exports.savePilot1 = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  try {
    // const _user = await userModel.findOne({ _id: user });

    await userModel.findById(user).updateOne({ $push: { savedPilots: id } });
    res.send("saved Successfully");
  } catch (err) {
    res.send("please Login");
  }
};

exports.getLicensedPilots = async (req, res) => {
  Pilot.find({ pilotType: "licensed" }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.getUnlicensedPilots = async (req, res) => {
  Pilot.find({ pilotType: "unlicensed" }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.activatePilot = async (req, res) => {
  const id = req.params.id;

  try {
    let job = await pilotModel.findById(id).updateOne({ status: true });
    res.send(job);
  } catch (err) {
    res.send(err);
  }
};

exports.deactivatePilot = async (req, res) => {
 const {id}=req.params
 
  try {
    let job = await userModel.findByIdAndUpdate(id,{deactivate:true},{new:true,upsert:true});
    await pilotModel.findOneAndUpdate({userId:id},{deactivate:true},{new:true,upsert:true});
    res.send(job);
 

  } catch (err) {
    res.send(err);
  }
};
exports.getLikedMedia = (req, res) => {
  const user = req.user._id;
  userModel
    .findById(user)
    .populate("likedMedia")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result.likedMedia);
      }
    });
};
exports.getDownloadedMedia = (req, res) => {
  const user = req.user._id;
  userModel
    .findById(user)
    .populate("downloadedMedia")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result.downloadedMedia);
      }
    });
};

exports.getPilotMedia = async (req, res) => {
  let id = req.params.id;
  let job = await pilotModel.findOne({ userName: id });
  if(job){
    await imageModel
    .find({ userId: job.userId, status: "active" })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result);
      }
    });
  }else{
    res.json({
      data: "noData"
    })
  }

  
};

exports.getPilotId = (req, res) => {
  const userId = req.body.userId;
  pilotModel.find({ userId: userId }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  });
};

exports.getMyProfilePictures = async (req, res) => {
  const user = req.body.id;

  const User = await userModel.findOne({ _id: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res
        .status(200)
        .send({ profilePic: result.profilePic, coverPic: result.coverPic });
    }
  });
};

exports.updateBasicInfo = async (req, res) => {
  const user = req.user._id;
  const {
    name,
    emailId,
    phoneNo,
    dob,
    gender,
    city,
    country,
    bio,
    userName,
    preferredLocation,
  } = req.body;
  try {
    let _user = await userModel.findOne({ _id: user });

    if (_user.email !== req.body.emailId) {
      let user2 = await userModel
        .findOne({ _id: _user._id })
        .updateOne({ name, email: req.body.emailId, phoneNo, verify: false });
    } else {
      let user1 = await userModel
        .findOne({ _id: _user._id })
        .updateOne({ name, email: req.body.emailId, phoneNo });
    }

    let job = await pilotModel.findOne({ userId: user });

    let pilot = await pilotModel
      .findOne({ userId: user })
      .updateOne({
        name,
        emailId,
        phoneNo,
        dob,
        gender,
        city,
        country,
        bio,
        userName,
        preferredLocation,
      })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          //   res.status(200).send({result
          // });
          res.send("Successfull");
        }
      });

    // .updateOne({ name, email: req.body.emailId, phoneNo})
  } catch (err) {
    res.send(err);
  }
};

exports.updateProfessionalInfo = async (req, res) => {
  const user = req.user._id;
  const {
    name,
    pilotType,
    certificates,
    droneId,
    droneType,
    workType,
    hourlyPayment,
    monthlyPayment,
    industry,
    trainingCenter,
    skills,
    completedYear,
  } = req.body;
  try {
    let job = await pilotModel.findOne({ userId: user });

    let pilot = await pilotModel
      .findOne({ userId: user })
      .updateOne({
        name,
        pilotType,
        certificates,
        droneId,
        droneType: req.body.drones,
        workType,
        hourlyPayment,
        monthlyPayment,
        industry,
        trainingCenter,
        skills,
        completedYear,
      })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          //   res.status(200).send({result
          // });
        }
      });

    // .updateOne({ name, email: req.body.emailId, phoneNo})

    res.send("Successfull");
  } catch (err) {
    res.send(err);
  }
};

exports.updateProfessionalInfo1 = async (req, res) => {
  const user = req.user._id;
  const data1 = req.body.industry.split(",");
  const dataSkill = req.body.skills.split(",");
  const drones1 = req.body.drones.split(",");

  const {
    name,
    pilotType,
    certificates,
    droneId,
    droneType,
    workType,
    hourlyPayment,
    monthlyPayment,
    industry,
    trainingCenter,
    skills,
    completedYear,
  } = req.body;
  console.log(req.body.industry);
  try {
    let job = await pilotModel.findOne({ userId: user });

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });

    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    // let buffer = data;

    const params1 = {
      Bucket: "nexdro",
      Key: `pilotCertificates/${myFile[0] + ext}.${fileType}`,
      Body: req.file.buffer,
    };

    s3.upload(params1, async (error, data) => {
      if (error) {
        res.status(500).send(error);
      }

      console.log(data);

      let pilot = await pilotModel
        .findOne({ userId: user })
        .updateOne({
          name,
          pilotType,
          certificates: data.key,
          droneId,
          droneType: drones1,
          workType,
          hourlyPayment,
          monthlyPayment,
          industry: data1,
          trainingCenter,
          skills: dataSkill,
          completedYear,
        })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.status(200).send({ result });
          }
        });

      // .updateOne({ name, email: req.body.emailId, phoneNo})
    });
  } catch (err) {
    res.send(err);
  }
};

exports.updatePilotInfo = async (req,res)=>{
  console.log(req.body)
  const user = req.user._id;
  let verify = true
  console.log(req.body)
  const {
    name, userName, email, phoneNo, dob, gender, city, country, bio, droneType, pilotType, droneId, industry, completedYear, trainingCenter, skills, status, workType, preferredLocation, monthlyPayment, hourlyPayment
  } = req.body
  if(email !== req.user.emailId){
    verify = false
  }
  userModel.findOne({_id: user}).update({
    name: name, email: email, phoneNo, country, city, dob, gender, bio, verify
  }).exec((err,result)=>{
    if(err){

    }else{

    }
  })
  pilotModel.findOne({userId: user}).update({
    name, emailId: email, phoneNo,dob,gender, city, country, bio, userName, preferredLocation, pilotType, droneType, droneId, industry, completedYear, trainingCenter, skills, status, workType, preferredLocation, monthlyPayment, hourlyPayment
  }).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}
exports.updatePilotInfo1 = async (req,res)=>{
  const user = req.user._id;
  const industry1 = req.body.industry.split(",");
  const dataSkill = req.body.skills.split(",");
  const drones1 = req.body.droneType.split(",");
  const {
    name, userName, email, phoneNo, dob, gender, city, country, bio, droneType, pilotType, droneId, industry, completedYear, trainingCenter, skills, status, workType, preferredLocation, monthlyPayment, hourlyPayment
  } = req.body
  let verify = true;
  if(email !== req.user.emailId){
    verify = false
  }
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  // let buffer = data;

  const params1 = {
    Bucket: "nexdro",
    Key: `pilotCertificates/${myFile[0] + ext}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params1, async (error, data) => {
    if (error) {
      res.status(500).send(error);
    }else{
      userModel.findOne({_id: user}).update({
        name: name, email: email, phoneNo, country, city, dob, gender, bio,verify
      }).exec((err,result)=>{
        if(err){
    
        }else{
    
        }
      })
      pilotModel.findOne({userId: user}).update({
        name, emailId: email, phoneNo, userName, pilotType, droneType: drones1, droneId, industry: industry1, completedYear, trainingCenter, skills: dataSkill, status, workType, preferredLocation, monthlyPayment, hourlyPayment, certificates: data.key
      }).exec((err,result)=>{
        if(err){
          res.send(err)
        }else{
          res.send(result)
        }
      })
    }
  })
  
}
exports.appliedJobsMine = async (req, res) => {
  const user = req.user._id;
  await pilotModel.findOne({ userId: user }).exec(async (err, result) => {
    if (err) {
      res.send(err);
    } else {
      await jobApplicationModel
        .find({ pilotId: result._id })
        .distinct("jobId")
        .exec((err, result1) => {
          if (err) {
            res.send(err);
          } else {
            jobModel.find({ _id: { $in: result1 } }).populate("companyId").exec((err, result) => {
              if (err) {
                res.send(err);
              } else {
                res.send(result);
              }
            });
          }
        });
    }
  });
};

exports.pilotFilters = async (req, res) => {
  const { keywords, address, workType, employeeType, drones, price } = req.body;
  console.log(req.body);
  let data = {};
  let data3 = {};
  data.status = true;
  if (employeeType.length !== 0) {
    data.workType = employeeType;
  }
  if (workType.length !== 0) {
    data.pilotType = workType;
  }
  if (drones.length !== 0) {
    regex1 = drones.join("|");
    data.droneType = { $regex: regex1, $options: "i" };
  }
  if (address !== "") {
    const addressData = address.split(",")[0];
    // console.log(first)
    data.city = { $regex: addressData, $options: "i" };
  }
  if (
    price &&
    employeeType.includes("part_time") &&
    employeeType.includes("full_time")
  ) {
    console.log("Both");
    // data.hourlyPayment = { $gte: price[0], $lte: price[1] };

    data3 = {
      $or: [
        { hourlyPayment: { $gte: price[0], $lte: price[1] } },
        { monthlyPayment: { $gte: price[0], $lte: price[1] } },
      ],
    };
  } else if (
    price &&
    employeeType.includes("part_time") &&
    !employeeType.includes("full_time")
  ) {
    console.log("part time");

    data.hourlyPayment = { $gte: price[0], $lte: price[1] };
  } else if (
    price &&
    employeeType.includes("full_time") &&
    !employeeType.includes("part_time")
  ) {
    console.log("full time");

    data.monthlyPayment = { $gte: price[0], $lte: price[1] };
  } else if (price && employeeType.length == 0) {
    console.log("none");
    data3 = {
      $or: [
        { hourlyPayment: { $gte: price[0], $lte: price[1] } },
        { monthlyPayment: { $gte: price[0], $lte: price[1] } },
      ],
    };
  }

  // $and: [ { $or: [{title: regex },{description: regex}] }, {category: value.category}, {city:value.city} ]
  //pagination

  const page = parseInt(req.query.page);
  const limit = 14;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  let deactivateCondition = { deactivate: { $ne: true } };


  if (
    endIndex <
    (await pilotModel
      .find({ $and: [data, data3,deactivateCondition] })
      .or([
        { industry: { $regex: keywords, $options: "i" } },
        { skills: { $regex: keywords, $options: "i" } },
        { userName: { $regex: keywords, $options: "i" } },
      ])
      .countDocuments()
      .exec())
  ) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }


  //pagination
  let data1 = pilotModel
    .find({ $and: [data, data3,deactivateCondition] })
    .or([
      { industry: { $regex: keywords, $options: "i" } },
      { skills: { $regex: keywords, $options: "i" } },
      { userName: { $regex: keywords, $options: "i" } },
    ])
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex)
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        console.log(result,'oooooo')
        results.results = result;
        res.send(results);
      }
    });
};

exports.getSuggestions = async (req, res) => {
  const { industry } = req.body;
 
        pilotModel
          .find({
            industry: { $regex: industry, $options: "i" },
          })
          .sort({ updatedAt: -1 })
          .limit(20)
          .exec(async(err, result1) => {
            if (err) {
              res.send(err);
            } else {
              let arr = []
              for(let i=0; i<result1.length ;i++){
                let data = {}
                data.data = result1[i];
                let shots = await imageModel.find({userId: result1[i].userId, status: "active"}).countDocuments()
                let followers = await userModel.find({_id : result1[i].userId})
                data.shots = shots
                data.followers = followers[0].followers.length
                arr.push(data)
              }
              res.send(arr)
            }
          });
      
};

exports.rearrangeImages = async (req, res) => {
  console.log(req.body,'oppo')
  const _user = req.user._id;
  await pilotModel
    .findOne({ userId: _user })
    .updateOne({ rearrangedImages: req.body.rearrangedImages })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.rearrangeVideos = async (req, res) => {
  const _user = req.user._id;
  await pilotModel
    .findOne({ userId: _user })
    .updateOne({ rearrangedVideos: req.body.rearrangedVideos })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.rearrange3d = async (req, res) => {
  const _user = req.user._id;
  await pilotModel
    .findOne({ userId: _user })
    .updateOne({ rearranged3d: req.body.rearranged3d })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.sendBillingData = async (req, res) => {
  const User = req.user._id;
  await pilotModel.findOne({ userId: User }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send({
        name: result.name,
        email: result.emailId,
        line1: result.line1,
        line2: result.line2,
        postal_code: result.postalAddress,
        city: result.city,
        state: result.state,
        country: result.country,
      });
    }
  });
};
exports.updateBillingAddress = async (req, res) => {
  const User = req.user._id;
  const { line1, line2, pin_code, city, state, country } = req.body;
  console.log(req.body);
  console.log(Number(pin_code));
  await pilotModel
    .findOne({ userId: User })
    .update({
      line1: line1,
      line2: line2,
      postalAddress: pin_code,
      city: city,
      state: state,
      country: country,
    })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.checkUserName = async (req, res) => {
  const userName = req.body.userName;
  console.log(req.body);
  const userExists = await pilotModel
    .find({ userName: userName })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length !== 0) {
          res.status(400).send("UserExists");
        } else {
          res.send("UserAvailable");
        }
      }
    });
};
exports.similarPilots = async (req,res)=>{
  const pilotId = req.params.id;
  
  pilotModel.findOne({userName: pilotId}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      if(result){
        let regex1 = result.skills.join("|");
        var re = new RegExp(regex1, "i");
        pilotModel.find({status: true}).or([
          { industry: { $regex: re } },
          { skills: { $regex: re} },
        ]).sort({createdAt : -1}).limit(6).select("name userId profilePic userName").exec((err,result1)=>{
          if(err){
            res.send(err)
          }else{
            res.send(result1)
          }
        })
      }else{
        res.json({
          data:"noData"
        })
      }
     
    }
  })
}

exports.getActivity = async (req,res)=>{
  const {userName} = req.params;
  pilotModel.findOne({userName}).exec((err,result)=>{
    if(err){
      console.log(err)
    }else{
      if(result){
        activityModel.find({userId: result.userId}).limit(5).populate("pilotId","name").populate("imageId", "postName").populate("centerId","centerName").sort({createdAt: -1}).exec((err,result1)=>{
          if(err){
            res.send(err)
          }else{
            if(result1.length > 0){
              res.send(result1)
            }else{
              res.send("No Pilot")
            }
            
          }
        })
      }else{
        res.send("No Pilot")
      }
      
    }
  })
}

exports.viewPilotProfile = async (req,res)=>{
  pilotModel.findOne({userName: req.params.id}).updateOne({$inc : {views :1, viewed: 1}}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}