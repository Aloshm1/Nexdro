const companyModel = require("../models/companyModel.js");
const Company = require("../models/companyModel.js");
const companyPlanModel = require("../models/companyPlanModel.js");
const companySubscriptionModal = require("../models/companySubscriptionModal.js");
const draftJobModel = require("../models/draftJobModel.js");
const crypto = require("crypto");
const jobModel = require("../models/jobModel.js");
const userModel = require("../models/userModel.js");
const mailSend = require("../../utils/mailSend.js")
exports.createCompany = (req, res) => {
  const user = req.user._id;
  const {
    companyType,
    companyName,
    emailId,
    phoneNo,
    contactPersonName,
    industry,
  } = req.body;
  let z = Math.floor(100000 + Math.random() * 900000);
  let r = `${z}-`
  let tempTitle = companyName.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(" ").join("-")
  let slugtemp = r+tempTitle
  const company = new Company({
    companyType,
    userId: user,
    companyName,
    emailId,
    phoneNo,
    contactPersonName,
    industry,
    slug: slugtemp
  });
  company.save((error, data) => {
    if (error) {
      return res.send(error);
    }
    if (data) {
      companyModel
        .findOne({ userId: req.user._id })
        .update({ country: req.user.country })
        .exec((err, result) => {
          if (result) {
            console.log(result);
          }
        });
      userModel
        .find({ _id: user })
        .update({ role: "company" })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            companyPlanModel
              .findOne({ planName: "free" })
              .exec(async (err, planResult) => {
                if (err) {
                  console.log(err);
                } else {
                  const _subscription = new companySubscriptionModal({
                    userId: user,
                    planName: "free",
                    activeJobs: planResult.activeJobs,
                    directHires: planResult.directHires,
                    draftJobs: planResult.draftJobs,
                    bookmarkPilots: planResult.bookmarkPilots,
                    suggestedPilots: planResult.suggestedPilots,
                    boostJob: planResult.boostJob,
                    proBadge: planResult.proBadge,
                  });
                  try {
                    const a1 = await _subscription.save();
                    console.log(a1);
                  } catch (err) {
                    console.log(err);
                  }
                }
              });
             res.status(201).json({
              company: data,
            });
            var mailOptions = {
              from: 'yaseen.nexevo@gmail.com',
              to: req.user.email,
              subject: 'Welcome to Nexdro Pilot Network',
              template: 'company',
              context: {
                companyName: req.body.companyName,
                slug:slugtemp,
                feUrl: process.env.BASE_URL,
                profilePic: req.user.profilePic,
                country: req.user.country
              }
            
            };
             mailSend(mailOptions)
          }
        });
    }
  });
};

exports.getCompanies = async (req, res) => {
  Company.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.onProcess = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  try {
    const company = await userModel
      .findOne({ userId: user })
      .update({ $push: { onProcess: id } });
    res.send("pushed successfully");
  } catch (err) {
    res.send("unsuccessfull");
  }
};

exports.companyData = async (req, res) => {
  const user = req.user._id;
  await companyModel.find({ userId: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({
        userName: req.user.name,
        phoneNo: req.user.phoneNo,
        emailId: req.user.email,
        profilePic: req.user.profilePic,
        coverPic: req.user.coverPic,
        company: result,
        _id: req.user._id,
      });
    }
  });
};

exports.editCompanyData = async (req, res) => {
  const user = req.user._id;
  const {
    userName,
    userPhoneNo,
    userEmail,
    companyName,
    officialEmail,
    officialPhoneNo,
    contactPerson,
    organizationType,
    gstNo,
    industry,
  } = req.body.formData;

  if (req.user.email !== userEmail) {
    userModel
      .findOne({ _id: user })
      .update({ verify: false })
      .exec((err, result) => {
        console.log(result);
      });
  }

  const user1 = await userModel.findOne({ _id: user });
  const company = await companyModel.findOne({ userId: user });

  const user2 = user1
    .updateOne({ name: userName, phoneNo: userPhoneNo, email: userEmail })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        company
          .updateOne({
            companyType: organizationType,
            companyName: companyName,
            emailId: officialEmail,
            phoneNo: officialPhoneNo,
            contactPersonName: contactPerson,
            industry: industry,
            gstNo,
          })
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

exports.getCompanyAddress = async (req, res) => {
  await companyModel.findOne({ userId: req.user._id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({
        name: req.user.name,
        email: req.user.email,
        line1: result.line1,
        line2: result.line2,
        pin_code: result.postalAddress,
        city: result.city,
        state: result.state,
        country: result.country,
      });
    }
  });
};

exports.updateCompanyAddress = async (req, res) => {
  const { line1, line2, pin_code, city, state } = req.body;
  await companyModel
    .findOne({ userId: req.user._id })
    .update({ line1, line2, postalAddress: pin_code, city, state })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.setViews = async (req, res) => {
  const { userId } = req.body;
  await companyModel.findOne({ userId: req.user._id }).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.viewed.includes(userId)) {
        res.send("Already seen");
      } else {
        companyModel
          .findOne({ userId: req.user._id })
          .update({ $push: { viewed: userId } })
          .exec((err, result2) => {
            if (err) {
              console.log(err);
            } else {
              companyModel
                .findOne({ userId: req.user._id })
                .update({ $inc: { views: 1 } })
                .exec((err, result3) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.send(result3);
                  }
                });
            }
          });
      }
    }
  });
};
exports.setProposals = async (req, res) => {
  await companyModel
    .findOne({ userId: req.user._id })
    .update({ $inc: { proposals: 1 } })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.getCompanySubscription = async (req, res) => {
  await companySubscriptionModal
    .findOne({ userId: req.user._id })
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        await companyModel
          .findOne({ userId: req.user._id })
          .exec((err, result1) => {
            if (err) {
              res.send(err);
            } else {
              jobModel
                .find({ userId: req.user._id, status: "active" })
                .exec((err, result2) => {
                  if (err) {
                    res.send(err);
                  } else {
                    draftJobModel
                      .find({ userId: req.user._id })
                      .exec((err, result3) => {
                        if (err) {
                          res.send(err);
                        } else {
                          res.status(200).json({
                            views: result1.views ? result1.views : 0,
                            proposals: result1.proposals
                              ? result1.proposals
                              : 0,
                            activeJobs: result2.length,
                            draftJobs: result3.length,
                            jobBoosts: result1.jobBoosts
                              ? result1.jobBoosts
                              : 0,
                            subscription: result,
                          });
                        }
                      });
                  }
                });
            }
          });
      }
    });
};

exports.getPlatinumCompanies = async (req, res) => {
  await userModel
    .find({ companyPlatinum: true })
    .distinct("_id")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        companyModel
          .find({ userId: result })
          .select("userId companyName")
          .exec((err, result1) => {
            if (err) {
              res.send(err);
            } else {
              res.send(result1);
            }
          });
      }
    });
};

exports.tempController = async (req, res) => {
  companyModel.find({}).exec((err, result) => {
    if (err) {
    } else {
      for (let i = 0; i < result.length; i++) {
        let z = Math.floor(100000 + Math.random() * 900000);
        let r = `${z}-`;
        let tempTitle = result[i].companyName
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .toLowerCase()
          .split(" ")
          .join("-");
        let slugtemp = r + tempTitle;
        companyModel
          .findOne({ _id: result[i]._id })
          .updateOne({ slug: slugtemp })
          .exec((err, result) => {
            console.log("Done");
          });
      }
      res.send("done");
    }
  });
};

exports.getCompanyData = async (req, res) => {
  let slug = req.params.slug;
  companyModel.findOne({ slug: slug }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.updateCompanyDetails = async (req, res) => {
  const { tagline, foundingYear, companySize, website, location, summary } =
    req.body;
  await companyModel
    .findOne({ userId: req.user._id })
    .updateOne({
      tagline,
      foundingYear,
      companySize,
      website,
      location,
      summary,
    })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.getCompanyDetails = async (req, res) => {
  companyModel.findOne({ userId: req.user._id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
