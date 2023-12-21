const companyModel = require("../models/companyModel");
const hireProposalModel = require("../models/hireProposalModel");
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend = require("../../utils/mailSend.js");
const pilotModel = require("../models/pilotModel");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");

exports.createProposal = async (req, res) => {
  const user = req.user._id;
  const { pilotId, message } = req.body;
  const pilot_1 = await pilotModel.findOne({ _id: pilotId });
  companyModel.findOne({ userId: user }).exec(async (err, result3) => {
    if (err) {
      res.send(err);
    } else {
      const application = new hireProposalModel({
        companyId: result3._id,
        pilotId: pilotId,
        message,
      });
      try {
        const a1 = await application.save();
        //chat
        chatModel
          .find({
            $and: [
              { users: { $elemMatch: { $eq: user } } },
              { users: { $elemMatch: { $eq: pilot_1.userId } } },
            ],
            chatType: "companyChat",
          })
          .exec(async (err, result) => {
            if (err) {
              console.log(err);
            } else {
              if (result.length !== 0) {
                const _message = await new messageModel({
                  message: req.body.message,
                  chatId: result[0]._id,
                  sender: user,
                  readBy: [user],
                });
                try {
                  const a2 = await _message.save();
                  console.log(a2);
                  await chatModel
                    .findOne({ _id: result[0]._id })
                    .update({ lastChat: a2._id })
                    .exec((err, result) => {});
                  //   await messageModel
                  //     .findOne({ _id: a1._id })
                  //     .update({ $push: { readBy: user } })
                  //     .exec((err, result) => {});
                } catch (err) {
                  console.log(err);
                }
                res.send([user, pilot_1.userId]);
              } else {
                console.log(result3.userId);
                const _chat = new chatModel({
                  users: [user, pilot_1.userId],
                  chatType: "companyChat",
                  companyId: result3._id,
                });
                try {
                  const a1 = await _chat.save();

                  const _message = await new messageModel({
                    message: req.body.message,
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
                    //   await messageModel
                    //     .findOne({ _id: a1._id })
                    //     .update({ $push: { readBy: user } })
                    //     .exec((err, result) => {});
                  } catch (err) {
                    console.log(err);
                  }
                  console.log(a1);
                } catch (err) {
                  console.log(err);
                }
                res.send([user, pilot_1.userId]);
              }
            }
          });

        //chat
        pilotModel.findOne({ _id: pilotId }).exec((err, result1) => {
          if (err) {
            console.log(err);
          } else {
            userModel
              .findOne({ _id: result1.userId })
              .exec(async (err, result2) => {
                if (err) {
                  console.log(err);
                } else {
                  if (result2.hiresMe === true) {
                   

var mailOptions = {
  from: 'yaseen.nexevo@gmail.com',
  to: result2.email,
  subject: ' New Job Porposal for you',
  template: 'hireproposal',
  context: {
   name: result2.name,
   companyName: result3.companyName,
   feUrl: process.env.BASE_URL,
   slug: result3.slug,
   city: result3.city,
   message: req.body.message,
   profilePic: req.user.profilePic
  }

};
await mailSend(mailOptions)
                    
                  }
                }
              });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  companyModel
    .findOne({ userId: user })
    .update({ $inc: { proposals: 1 } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
};

exports.sampleData = async (req, res) => {
  const userId = req.body.userId;
  await pilotModel
    .findOne({ userId })
    .distinct("_id")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.pilotProposals = async (req, res) => {
  const user = req.user._id;
  await pilotModel.findOne({ userId: user }).exec(async (err, result1) => {
    if (err) {
      res.send(err);
    } else {
      await hireProposalModel
        .find({ pilotId: result1._id })
        .populate("companyId", "companyName emailId phoneNo userId profilePic country")
        .sort({ createdAt: -1 })
        .exec(async(err, result2) => {
          if (err) {
            res.send(err);
          } else {
            let arr = []
            for (let i = 0; i < result2.length; i++) {
              let data = {}
              data.data = result2[i]
              let chat = await chatModel.find({
                chatType: "companyChat",
                $and: [
                  { users: { $elemMatch: { $eq: result2[i].companyId.userId } } },
                  { users: { $elemMatch: { $eq: user } } },
                ],
              });
              let allMessages = await messageModel
                .find({ chatId: chat[0]._id })
                .countDocuments();
                data.allMessages = allMessages
              let unRead = await messageModel
                .find({ chatId: chat[0]._id, readBy: { $nin: [user] } })
                .countDocuments();
                data.unRead = unRead
              let lastChat = await messageModel
                .findOne({ chatId: chat[0]._id })
                .sort({ createdAt: -1 });
             data.lastChat = lastChat.createdAt
             arr.push(data)
            }
            res.send(arr)
          }
        });
    }
  });
};

exports.companyProposals = async (req, res) => {
  let status ;
  if(req.body.status === "All"){
    status = ["In Process", "Hired", "Canceled"]
  }else{
    status = req.body.status
  }
  const user = req.user._id;
  await companyModel.findOne({ userId: user }).exec(async (err, result1) => {
    if (err) {
      res.send(err);
    } else {
      console.log(status)
      await hireProposalModel
        .find({ companyId: result1._id, status: status })
        .populate("pilotId", "name pilotType workType userName userId city phoneNo emailId")
        .sort({ createdAt: -1 })
        .exec(async (err, result2) => {
          if (err) {
            res.send(err);
          } else {
            let arr = []
            for (let i = 0; i < result2.length; i++) {
              let data = {}
              data.data = result2[i]
              let chat = await chatModel.find({
                chatType: "companyChat",
                $and: [
                  { users: { $elemMatch: { $eq: result2[i].pilotId.userId } } },
                  { users: { $elemMatch: { $eq: user } } },
                ],
              });
              let allMessages = await messageModel
                .find({ chatId: chat[0]._id })
                .countDocuments();
                data.allMessages = allMessages
              let unRead = await messageModel
                .find({ chatId: chat[0]._id, readBy: { $nin: [user] } })
                .countDocuments();
                data.unRead = unRead
              let lastChat = await messageModel
                .findOne({ chatId: chat[0]._id })
                .sort({ createdAt: -1 });
             data.lastChat = lastChat.createdAt
             arr.push(data)
            }
            res.send(arr)
          }
        });
    }
  });
};


exports.changeProposalStatus = async (req,res)=>{
  hireProposalModel.findOne({_id: req.body.id}).updateOne({status: req.body.status}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
}