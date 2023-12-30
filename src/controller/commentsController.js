const userModel = require("../models/userModel");
const commentsModel = require("../models/commentsModel");
const imageModel = require("../models/imageModel");
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend = require("../../utils/mailSend.js");
const activityModel = require("../models/activityModel");

exports.createComment = async (req, res) => {
  console.log('oooohoohhoohoh')
  const imageId = req.params.id;
  const user = req.user._id;
  const profilePic = req.user.profilePic;

  const _user = await userModel.findOne({ _id: user });

  const name = _user.name;

  const { comment } = req.body;
  const _comment = new commentsModel({
    userId: user,
    imageId,
    name,
    comment,
    profilePic,
  });
  try {
    const a1 = await _comment.save();
    console.log(a1,'cmnt')
    res.json(a1);

    const image = await imageModel
      .findOne({ _id: imageId })
      .exec((err, result3) => {
        if (err) {
          res.send(err);
        } else {
          const User = userModel
            .findOne({ _id: result3.userId })
            .exec((err, result) => {
              if (err) {
                res.send(err);
              } else {
                if (result.commentsMe === true) {
                  var mailOptions = {
                    from: "alosh.nexevo@gmail.com",
                    to: result.email,
                    subject: `New comment on your shot`,
                    template: "comments",
                    context: {
                      name1: req.user.name,
                      name: result3.name,
                      shotTitle: result3.postName,
                      comment: req.body.comment,
                      feUrl: process.env.BASE_URL,
                      slug: result3.slug,
                    },
                  };
                  mailSend(mailOptions);
                  //yaseen
                }
              }
            });
        }
      });
  } catch (err) {
    res.send("error");
  }
  imageModel
    .findById(imageId)
    .update({ $inc: { commentCount: 1 } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  const activity = new activityModel({
    name: "comment",
    userId: user,
    link: `/image/${imageId}`,
    imageId: imageId,
  });
  try {
    const a1 = await activity.save();
    console.log(a1);
  } catch (err) {
    console.log(err);
  }
};

exports.getComments = async (req, res) => {
  const id = req.params.id;
  const page = parseInt(req.query.page);
  const limit = 15;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  imageModel.findOne({ slug: id }).exec(async (err, result1) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      if (endIndex < (await commentsModel.countDocuments().exec())) {
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
      commentsModel
        .find({ imageId: result1._id })
        .populate("userId")
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(result);
          }
        });
    }
  });
};
exports.likeComment = async (req, res) => {
  const commentId = req.body.commentId;
  const user = req.user._id;
  const comment = await commentsModel.findOne({ _id: commentId });

  // console.log(id, user);
  try {
    await commentsModel
      .find({ _id: commentId })
      .updateOne({ $push: { likes: user } });
    await userModel
      .find({ _id: user })
      .updateOne({ $push: { likedComments: commentId } });
  } catch (err) {
    res.send(err);
  }
  res.send(comment);
};

exports.unlikeComment = async (req, res) => {
  const commentId = req.body.commentId;
  const user = req.user._id;
  const comment = await commentsModel.findOne({ _id: commentId });

  // console.log(id, user);
  try {
    await commentsModel
      .find({ _id: commentId })
      .updateOne({ $pull: { likes: user } });
    await userModel
      .find({ _id: user })
      .updateOne({ $pull: { likedComments: commentId } });
  } catch (err) {
    res.send(err);
  }
  res.send(comment);
};

exports.getMyComments = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(result.likedComments);
    }
  });
};

exports.getMyUserId = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(result._id);
    }
  });
};
exports.deleteComment=async(req,res)=>{
  const {commentId}=req.body
  console.log(commentId,'deletecmnt')
  await commentsModel.findOneAndDelete({_id:commentId}).then((response)=>{
    res.send(response)
  })
}
