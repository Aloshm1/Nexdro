const jobApplicationModel = require("../models/jobApplicationModel.js");
const jobModel = require("../models/jobModel.js");
const Jobs = require("../models/jobModel.js");
const pilotModel = require("../models/pilotModel.js");
const userModel = require("../models/userModel.js");
const User = require("../models/userModel.js");
const companyModel = require("../models/companyModel");
const chatModel = require("../models/chatModel.js");
const messageModel = require("../models/messageModel.js");

exports.sendData = async (req, res) => {
  const user = req.user._id;
  const {
    jobTitle,
    industry,
    address,
    city,
    state,
    country,
    jobType,
    employeeType,
    minSalary,
    maxSalary,
    salaryType,
    postingDate,
    workLocation,
    jobDesc,
    status,
    noOfOpenings,
    experience,
  } = req.body;

  let z = Math.floor(100000 + Math.random() * 900000);
  let r = `${z}-`;
  let tempTitle = jobTitle
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;
  console.log(req.body);
  await companyModel
    .findOne({ userId: req.user._id })
    .exec(async (err, result) => {
      console.log(result);
      const job = new Jobs({
        userId: user,
        companyId: result._id,

        jobTitle,
        industry,

        jobType,
        employeeType,
        minSalary,
        maxSalary,
        salaryType,
        postingDate,
        workLocation,
        jobDesc,
        status,
        noOfOpenings,
        slug: slugtemp,
        experience,
      });
      try {
        const a1 = await job.save();
        res.json(a1);
      } catch (err) {
        res.send("error");
      }
    });
};

//applyJobs page
exports.getJobs = async (req, res) => {
  Jobs.findOne({})
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(res.paginatedResults);
      }
    });
};

exports.jobLanding = (req, res) => {
  const id = req.params.id;
  Jobs.findById(id).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.getFilterJobs = async (req, res) => {
  const city = req.query.city;
  const country = req.query.country;
  const employeeType = req.query.employeeType;
  const jobType = req.query.jobType;
  const minSalary = req.query.minSalary;
  const maxSalary = req.query.maxSalary;
  const data = { status: "active" };
  if (city) {
    data.city = city;
  }
  if (country) {
    data.state = country;
  }
  if (employeeType) {
    data.employeeType = employeeType;
  }
  if (jobType) {
    data.jobType = jobType;
  }
  if (minSalary) {
    data.minSalary = minSalary;
  }
  if (maxSalary) {
    data.maxSalary = maxSalary;
  }
  Jobs.find(data, (err, result) => {
    console.log(data);
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.applyJob = async (req, res) => {
  // const newAge = req.body.newAge;
  const id = req.params.id;
  const user = req.user._id;

  try {
    const pilot = await pilotModel.findOne({ userId: user });
    await Jobs.findById(id).updateOne({ $push: { applications: pilot._id } });
    await pilotModel
      .findById(pilot._id)
      .updateOne({ $push: { appliedJobs: id } });
  } catch (err) {
    res.send("please Login");
  }
};

exports.likeJob = async (req, res) => {
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

exports.unlikeJob = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  console.log(id, user);
  try {
    const pilot = await pilotModel.findOne({ userId: user });

    await pilotModel
      .findById(pilot._id)
      .updateOne({ $pull: { savedJobs: id } });
    res.send("unLiked Successfully");
  } catch (err) {
    res.send("please Login");
  }
};

exports.getApprovedJobs = async (req, res) => {
  const user = req.user._id;
  try {
    const jobs = await jobModel
      .find({ userId: user, status: "active" })
      .populate("companyId")
      .sort({ createdAt: -1 })
      .exec(async (err, result) => {
        if (err) {
          res.send(err);
        } else {
          let arr = []
          for(let i=0 ; i< result.length; i++){
            let data = {}
            data.data = result[i]
            let chats = await chatModel.find({jobId: result[i]._id}).distinct("lastChat")
            let unRead = await messageModel.find({_id : chats, readBy: { $nin: [req.user._id] } }).countDocuments()
            data.unRead = unRead
            let jobApps = await jobApplicationModel.find({jobId: result[i]._id}).countDocuments()
            data.jobApps = jobApps
            arr.push(data)
          }
          res.send(arr)
        
        }
      });
  } catch (err) {
    res.send(err);
  }
};
exports.getPendingJobs = async (req, res) => {
  const user = req.user._id;
  try {
    const jobs = await jobModel
      .find({ userId: user, status: "pending" })
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  } catch (err) {
    res.send(err);
  }
};

exports.getExpiredJobs = async (req, res) => {
  const user = req.user._id;
  try {
    const jobs = await jobModel
      .find({ userId: user, status: "expired" })
      .populate("companyId")
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  } catch (err) {
    res.send(err);
  }
};

exports.deleteJob = async (req, res) => {
  // const newAge = req.body.newAge;
  const id = req.params.id;
  // const user= req.user._id;

  try {
    let job = await jobModel.findById(id).updateOne({ status: "closed" });
    res.send(job);
  } catch (err) {
    res.send("please Login");
  }
};

exports.getApplications = (req, res) => {
  const id = req.params.id;
  jobModel
    .findById(id)
    .populate("applications")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(result.applications);
      }
    });
};

exports.expireJob = async (req, res) => {
  jobModel
    .findById(req.body.jobId)
    .update({ status: "expired" })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.editJob = (req, res) => {
  const user = req.user._id;
  const id = req.params.id;
  const {
    jobTitle,
    industry,
    employeeType,
    jobType,
    minSalary,
    maxSalary,
    salaryType,
    workLocation,
    jobDesc,
    noOfOpenings,
    experience,
  } = req.body;
  let z = Math.floor(100000 + Math.random() * 900000);
  let r = `${z}-`;
  let tempTitle = jobTitle
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;
  jobModel.findById(id).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (!result.userId.equals(user)) {
        res.status(400).send("Invalid Access");
      } else {
        jobApplicationModel.find({ jobId: id }).exec((err, result1) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result1);
            if (result1.length == 0) {
              jobModel
                .findById(id)
                .update({
                  jobTitle,
                  industry,
                  employeeType,
                  jobType,
                  minSalary,
                  maxSalary,
                  salaryType,
                  workLocation,
                  jobDesc,
                  noOfOpenings,
                  slug: slugtemp,
                  experience,
                })
                .exec((err, result2) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.send(result2);
                  }
                });
            } else {
              jobModel
                .findById(id)
                .update({ status: "expired" })
                .exec(async (err, result3) => {
                  if (err) {
                    res.send(err);
                  } else {
                    companyModel
                      .findOne({ userId: result.userId })
                      .exec(async (err, result2) => {
                        if (result2) {
                          const job = new jobModel({
                            userId: user,
                            companyId: result2._id,
                            jobTitle,
                            industry,

                            jobType,
                            employeeType,
                            minSalary,
                            maxSalary,
                            salaryType,

                            workLocation,
                            jobDesc,

                            noOfOpenings,
                            slug: slugtemp,
                            experience,
                          });
                          try {
                            const a1 = await job.save();
                            res.json(a1);
                          } catch (err) {
                            res.send("error");
                          }
                        }
                      });
                  }
                });
            }
          }
        });
      }
    }
  });
};

exports.filterJobs = async (req, res) => {
  const { keywords, employeeType, jobType, price, address } = req.body;
  console.log(req.body);
  const data = {
    status: "active",
  };
  if (price) {
    (data.minSalary = { $gte: price[0] }),
      (data.maxSalary = { $lte: price[1] });
  }
  if (employeeType.length !== 0) {
    data.employeeType = employeeType;
  }
  if (jobType.length !== 0) {
    data.jobType = jobType;
  }
  if (address) {
    const addressData = address.split(",")[0];
    data.workLocation = { $regex: addressData, $options: "i" };
  }

  //pagination
  const page = parseInt(req.query.page);
  const limit = 14;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (
    endIndex <
    (await jobModel
      .find(data)
      .or([
        { jobTitle: { $regex: keywords, $options: "i" } },
        { industry: { $regex: keywords, $options: "i" } },
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
  console.log(data);
  const data1 = jobModel
    .find(data)
    .or([
      { jobTitle: { $regex: keywords, $options: "i" } },
      { industry: { $regex: keywords, $options: "i" } },
    ])
    .sort({ updatedAt: -1 })
    .populate("companyId")
    .limit(limit)
    .skip(startIndex)
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        results.results = result;
        res.send(results);
      }
    });
};

exports.getJobByName = async (req, res) => {
  const { userId } = req.params;
  await jobModel
    .find({ userId: userId , status:"active"})
    .populate("companyId")
    .populate("userId", "companyPlatinum")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getIdBySlug = async (req, res) => {
  console.log(req.params.slug);
  jobModel.findOne({ slug: req.params.slug }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        res.json({ id: result._id });
      } else {
        res.json({
          id: "noData",
        });
      }
    }
  });
};
exports.boostJob = async (req, res) => {
  const id = req.body.id;

  jobModel
    .findOne({ _id: id })
    .updateOne({ $inc: { boostCount: 1 } })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        companyModel
          .findOne({ userId: req.user._id })
          .updateOne({ $inc: { jobBoosts: 1 } })
          .exec((err, result) => {
            if (err) {
              res.send(err);
            } else {
              res.send(result);
            }
          });
      }
    });
};

exports.getCompanyJobs = async (req,res)=>{
  companyModel.find({slug: req.params.slug}).exec((err,result)=>{
    if(result.length == 0){
      res.send("No Data")
    }else{
      jobModel.find({userId: result[0].userId, status : "active"}).populate("companyId", "companyName profilePic").exec((err,result)=>{
        if(err){
          res.send(err)
        }else{
          res.send(result)
        }
      })
    }
  })
}