const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");

exports.createChat = async (req, res) => {
  const userId = req.user._id;
  const otherId = req.body.otherId;
  let chatType = req.body.chatType;
  let jobId = req.body.jobId;
  chatModel
    .find({
      jobId,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: otherId } } },
      ],
    })
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length == 0) {
          const _chat = new chatModel({
            chatType,
            users: [userId, otherId],
            jobId,
          });
          try {
            const a1 = await _chat.save();
            res.json(a1);
          } catch (err) {
            res.send("error");
          }
        } else {
          res.json({
            _id: result[0]._id,
          });
        }
      }
    });
};

exports.getChatDetails = async (req, res) => {
  chatModel.findOne({ _id: req.params.id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
exports.getChatDetailsPopulated = async (req, res) => {
  chatModel
    .findOne({ _id: req.params.id })
    .populate("users jobId companyId centerId")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getMyChats = async (req, res) => {
  let userId = req.user._id;
  chatModel
    .find({ users: { $elemMatch: { $eq: userId } } })
    .populate("jobId users lastChat centerId companyId")
    .sort({ updatedAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
     
        chatModel
    .find({ users: { $elemMatch: { $eq: userId } } })
    .distinct("lastChat")
    .exec(async (err, result1) => {
      if (err) {
        res.send(err);
      } else {
        const messages = await messageModel.find({ _id: result1, readBy: { $nin: [req.user._id] } }).countDocuments()
          res.json({
            unreadChats : messages,
            data: result
          })
      }
    });
      }
    });
};

exports.makemessagesRead = async (req, res) => {
  messageModel
    .find({ chatId: req.params.chatId, readBy: { $nin: [req.user._id] } })
    .update({ $push: { readBy: req.user._id } })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getCompanyChat = async (req, res) => {
  const userId = req.user._id;
  const otherId = req.body.otherId;
  chatModel
    .find({
      chatType: "companyChat",
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: otherId } } },
      ],
    })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
exports.getCenterEnquiry = async (req, res) => {
  const userId = req.user._id;
  const otherId = req.body.otherId;
  chatModel
    .find({
      chatType: "centerEnquiry",
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: otherId } } },
      ],
    })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getUnreadChats = async (req, res) => {
  const userId = req.user._id;
  chatModel
    .find({ users: { $elemMatch: { $eq: userId } } })
    .distinct("lastChat")
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        const messages = await messageModel.find({ _id: result, readBy: { $nin: [req.user._id] } }).countDocuments()
          res.json({
            unreadChats : messages
          })
      }
    });
};
