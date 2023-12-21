var cron = require("node-cron");
const jobModel = require("../models/jobModel");
const companyModel = require("../models/companyModel");
const moment = require("moment");
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend = require("../../utils/mailSend")
const keywordsModel = require("../models/keywordsModel");
const pilotModel = require("../models/pilotModel");
const userModel = require("../models/userModel");
exports.createKeyword = async (req, res) => {
  const { keyword } = req.body;
  const _industry = new keywordsModel({
    keyword,
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
};

exports.getKeywords = async (req, res) => {
  keywordsModel
    .find({})
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.deleteKeyword = async (req, res) => {
  let id = req.params.id;
  keywordsModel.deleteOne({ _id: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

cron.schedule("1 47 15 * * *", () => {
  userModel
    .find({ pilotPro: true })
    .distinct("_id")
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(result)
        pilotModel
          .find({ userId: result })
          .select("emailId name skills industry")
          .exec((err, result1) => {
            if (err) {
              console.log(err);
            } else {
              // res.send(result1)
              const today = moment().startOf("day");

              const data = result1;
              // console.log(data)
              data.map((item, i) => {
                // console.log(item)
                const dataArray = item.skills.concat(item.industry);
                re = dataArray.join("|");

                jobModel
                  .find({
                    createdAt: {
                      $gte: today.toDate(),
                      $lte: moment(today).endOf("day").toDate(),
                    },
                  })
                  .or([
                    { jobTitle: { $regex: re, $options: "i" } },
                    { industry: { $regex: re, $options: "i" } },
                  ])
                  .exec(async(err, result2) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(item.emailId);
                      console.log(i);
                      let arr = []
                      for(let i=0; i< result2.length; i++){
                        let data = {}
                        let user = await userModel.findOne({_id: result2[i].userId})
                        data.profilePic = user.profilePic,
                        data.country = user.country,
                        data.feUrl = process.env.BASE_URL,
                        data.jobTitle = result2[i].jobTitle,
                        jobSlug = result2[i].slug
                        let company = await companyModel.findOne({userId:result2[i].userId })
                        data.companyName= company.companyName,
                        data.slug = company.slug

                        arr.push(data)
                      }
                      var mailOptions = {
                        from: 'alosh.nexevo@gmail.com',
                        to: item.emailId,
                        subject: 'Recommended Jobs list for you',
                        template: 'jobNotifications',
                        context: {
                          name: item.name,
                          jobs: arr
                        }
                      
                      };

                       mailSend(mailOptions)
                    }
                  });
              });
            }
          });
      }
    });
});

exports.jobNotification = async (req, res) => {};
