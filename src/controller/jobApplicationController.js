const jobApplicationModel = require("../models/jobApplicationModel");
const pilotModel = require("../models/pilotModel");
const jobModel = require("../models/jobModel");
const userModel = require("../models/userModel");
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend = require("../../utils/mailSend.js");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const companyModel = require("../models/companyModel");
exports.createJobApplication = async (req, res) => {
  const user = req.user._id;
  const { jobId, message } = req.body;
  let job = await jobModel.findOne({_id: jobId})
  let company = await companyModel.findOne({userId: job.userId})
  await pilotModel.findOne({ userId: user }).exec(async (err, result) => {
    if (err) {
      res.send(err);
    } else {
      const application = new jobApplicationModel({
        jobId: jobId,
        message,
        pilotId: result._id,
      });
      try {
        const a1 = await application.save();
        jobModel.findOne({ _id: jobId }).exec((err, result2) => {
          if (err) {
          } else {
            userModel
              .findOne({ _id: result2.userId })
              .exec(async (err, result1) => {
                if (err) {
                  console.log(err);
                } else {
                  chatModel
                    .find({
                      jobId,
                      $and: [
                        { users: { $elemMatch: { $eq: user } } },
                        { users: { $elemMatch: { $eq: result1._id } } },
                      ],
                    })
                    .exec(async (err, result) => {
                      if (err) {
                        console.log(err);
                      } else {
                        if (result.length == 0) {
                          const _chat = new chatModel({
                            users: [user, result1._id],
                            jobId,
                            chatType: "jobApplication",
                          });
                          try {
                            const a1 = await _chat.save();

                            const _message = await new messageModel({
                              message,
                              chatId: a1._id,
                              sender: user,
                              readBy: [user],
                            });
                            try {
                              const a2 = await _message.save();
                              console.log(a2);
                              await chatModel
                                .findOne({ _id: a1._id })
                                .update({ lastChat: a2._id })
                                .exec((err, result) => {});
                              await messageModel
                                .findOne({ _id: a1._id })
                                .update({ $push: { readBy: user } })
                                .exec((err, result) => {});
                            } catch (err) {
                              console.log(err);
                            }
                            console.log(a1);
                          } catch (err) {
                            console.log(err);
                          }
                        } else {
                          console.log("ewfwe");
                        }
                      }
                    });
                  res.json({ data: [user, result1._id] });
                  if (result1.appliesMe) {
                    var mailOptions = {
                      from: 'alosh.nexevo@gmail.com',
                      to: result1.email,
                      subject: 'New Application for your Job Post',
                      template: 'jobApplication',
                      context: {
                       companyName: company.companyName,
                       pilotName: result.name,
                       jobTitle: result2.jobTitle,
                       profilePic: req.user.profilePic,
                       feUrl: process.env.BASE_URL,
                       slug: result.userName,
                       message: req.body.message
                      }
                    
                    };
                    await mailSend(mailOptions)
                    let message = `Greetings from Drone
There is a application by ${result.name} on ${result2.jobTitle}

Message by applicant: ${req.body.message}

Login to dashboard to know more


Thank You
Team Nexdro
                                          `;

                                          

                   
                  }
                }

                //chat creation
              });
          }
        });
      } catch (err) {
        res.send("error");
      }
    }
  });
};

exports.getApplications = async (req, res) => {
  const user = req.user._id;
  const jobId = req.body.jobId;
  let status;
  if(req.body.status == "All"){
    status = ["Selected", "Rejected", "Pending"]
  }else{
    status = req.body.status
  }
  console.log(status)
  await jobApplicationModel
    .find({ jobId , status: status})
    .populate({
      path: "pilotId",
      select: "userId name pilotType city userName",
      populate: {
        path: "userId",
        select: "name email phoneNo",
      },
    }).sort({createdAt: -1})
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        let arr = []
        for(let i=0; i<result.length ;i++){
          let chat = await chatModel.find({
            chatType: "jobApplication",
            jobId: jobId,
            $and: [
              { users: { $elemMatch: { $eq: result[i].pilotId.userId._id } } },
              { users: { $elemMatch: { $eq: user } } },
            ],
          });
         let data = {}
         data.data= result[i]
          let allMessages = await messageModel.find({chatId : chat[0]._id}).countDocuments()
          data.allMessages = allMessages
          let unRead = await messageModel
          .find({ chatId: chat[0]._id, readBy: { $nin: [user] } }).countDocuments()
          data.unRead = unRead
        let lastChat = await messageModel.findOne({chatId : chat[0]._id}).sort({createdAt: -1})
        data.lastChat = lastChat.createdAt
        arr.push(data)
        }
        res.send(arr)
      }
    });
};

exports.getMyAppliedJobs = async (req, res) => {
  const user = req.user._id;
  pilotModel.findOne({ userId: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      jobApplicationModel
        .find({ pilotId: result._id })
        .distinct("jobId")
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

exports.changeJobStatus = async (req,res)=>{
  jobApplicationModel.findOne({_id: req.body.id}).updateOne({status: req.body.status}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}