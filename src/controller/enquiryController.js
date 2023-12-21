const enquiryModel = require("../models/enquiryModel");
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend = require("../../utils/mailSend.js");
const userModel = require("../models/userModel");
const service_centerModel = require("../models/service_centerModel");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");

exports.createEnquiry = async (req, res) => {
  const user = req.user._id;
  const id = req.params.id;
  console.log(id);
  const { name, emailId, phoneNo, message } = req.body;
  const _enquiry = new enquiryModel({
    userId: user,
    name,
    phoneNo,
    emailId,
    message,
    centerId: id,
    location: req.user.country,
  });
  try {
    const a1 = await _enquiry.save();

    const centeruser = await service_centerModel.find({ _id: id });
    const userCenter = await userModel.findById(centeruser[0].userId);

  

    if (user !== userCenter._id) {
      chatModel
        .find({
          $and: [
            { users: { $elemMatch: { $eq: user } } },
            { users: { $elemMatch: { $eq: userCenter._id } } },
          ],
        })
        .exec(async (err, result) => {
          if (err) {
            console.log(err);
          } else {
            if (result.length == 0) {
              const _chat = new chatModel({
                users: [user, userCenter._id],
                chatType: "centerEnquiry",
                centerId: id,
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
              const _message = new messageModel({
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
                  .exec((err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(result);
                    }
                  });
                await messageModel
                  .findOne({ _id: a1._id })
                  .update({ $push: { readBy: user } })
                  .exec((err, result) => {});
                console.log("efewbn");
              } catch (err) {
                console.log(err);
              }
            }
          }
        });
      res.json({ data: [user, userCenter._id] });
    } else {
      res.json({ data: "enquirySent" });
    }

    if (userCenter.enquiresMe === true) {
      var mailOptions = {
        from: 'yaseen.nexevo@gmail.com',
        to: userCenter.email,
        subject: 'New enquiry for your service centre',
        template: 'enquiry',
        context: {
          name: userCenter.name,
          name1: req.user.name,
          centerName: centeruser[0].centerName,
          enquiry: req.body.message,
          feurl: process.env.BASE_URL
        }
      
      };
      await mailSend(mailOptions)

    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

exports.getEnquiries = async (req, res) => {
  const user = req.user._id;
  console.log(user);
  const center = await service_centerModel
    .findOne({ userId: user })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        enquiryModel
          .find({ centerId: result._id })
          .sort({ createdAt: -1 })
          .exec(async(err, result1) => {
            if (err) {
              res.send(err);
            } else {
              let arr = []
              for(let i=0; i< result1.length; i++){
                let data ={}
                data.data = result1[i];
                let chat = await chatModel.find({
                  chatType: "centerEnquiry",
                  $and: [
                    { users: { $elemMatch: { $eq: result.userId } } },
                    { users: { $elemMatch: { $eq: result1[i].userId } } },
                  ],
                });
                let allMessages = await messageModel.find({chatId : chat[0]._id}).countDocuments()
                data.allMessages = allMessages
                let unRead = await messageModel
                .find({ chatId: chat[0]._id, readBy: { $nin: [result.userId] } }).countDocuments()
                data.unRead = unRead
              let lastChat = await messageModel.findOne({chatId : chat[0]._id}).sort({createdAt: -1})
              data.lastChat = lastChat.createdAt
                arr.push(data)

              }
              res.send(arr)
            }
          });
      }
    });
};


exports.changeEnquiryStatus = async (req,res)=>{
    enquiryModel.findOne({_id: req.body.id}).updateOne({status: req.body.status}).exec((err,result)=>{
      if(err){
        res.send(err)
      }else{
        res.send(result)
      }
    })
}