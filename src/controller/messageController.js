const e = require("express");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
exports.createMessage = async (req, res) => {
  const { message, chatId } = req.body;
  const userId = req.user._id;

  const _message = new messageModel({
    message,
    chatId,
    sender: userId,
  });
  try {
    const a1 = await _message.save();

    await chatModel
      .findOne({ _id: chatId })
      .update({ lastChat: a1._id })
      .exec((err, result) => {});
    await messageModel
      .findOne({ _id: a1._id })
      .update({ $push: { readBy: userId } })
      .exec((err, result) => {});
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
};

exports.getMessages = async (req, res) => {
  await messageModel
    .find({ chatId: req.params.chatId })
    .populate("sender")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getNotRead = async (req, res) => {
  console.log(req.user._id);
  messageModel
    .find({ chatId: req.params.chatId, readBy: { $nin: [req.user._id] } })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
