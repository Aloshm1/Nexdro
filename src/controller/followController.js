const followModel = require("../models/followModel");
const pilotModel = require("../models/pilotModel");
const userModel = require("../models/userModel");
const imageModel = require("../models/imageModel");
const companyModel=require("../models/companyModel")
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend = require("../../utils/mailSend.js");
const activityModel = require("../models/activityModel");
const service_centerModel = require("../models/service_centerModel");

exports.followMe = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  const me = await userModel.findOne({ _id: user }).update();
};

exports.createFollow = async (req, res) => {
  const id = req.params.id; //pilot id
  const user = req.user._id;
  const _user = await pilotModel.findOne({ _id: id });
  const followerUser = await userModel.findOne({ _id: user });

  const followingUser = await userModel.findOne({ _id: _user.userId });
  // console.log(followingUser);
let slug ;
if(req.user.role == "pilot"){
  await pilotModel.findOne({userId: req.user._id}).exec((err,result)=>{
    slug = `pilot/${result.userName}`
  })
}
else if(req.user.role == "company"){
  await companyModel.findOne({userId: req.user._id}).exec((err,result)=>{
    slug = `company/${result.slug}`
  })
}
else if(req.user.role == "service_center"){
  await service_centerModel.findOne({userId: req.user._id}).exec((err,result)=>{
    slug = `service-center/${result.slug}`
  })
}
  await followerUser.updateOne({ $push: { following: followingUser._id } });
  await followingUser.updateOne({ $push: { followers: followerUser._id } });
  if (followingUser.followsMe === true) {
    var mailOptions = {
      from: 'yaseen.nexevo@gmail.com',
      to: followingUser.email,
      subject: 'You have a new follower',
      template: 'follow',
      context: {
        pilotName: req.user.name,
        profilePilot: followingUser.name,
        profilePic: req.user.profilePic,
        city: followingUser.city,
        feUrl: process.env.BASE_URL,
        slug: slug,
        mySlug: _user.userName
      }
    
    };
    await mailSend(mailOptions)
    let message = `Greetings from Drone
    
Your profile was followed by ${followerUser.name}.

Check your dashboard to see all followers and view them
            
Thank You,
Team Nexdro
                `;

    // sendMailVerify(followingUser.email, "Pilot Followed | Nexdro", message);
  }

  const follow = new followModel({
    userId: user,
    followerId: _user.userId,
  });
  try {
    const a1 = await follow.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }

  pilotModel.findOne({ userId: _user.userId }).exec(async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const activity = new activityModel({
        name: "follow",
        userId: user,
        link: `/pilot/${result.userName}`,
        pilotId: result._id,
      });
      try {
        const a1 = await activity.save();
        console.log(a1);
      } catch (err) {
        console.log(err);
      }
    }
  });
};
exports.removeFollow = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  const _user = await pilotModel.findOne({ _id: id });
  const followerUser = await userModel.findOne({ _id: user });
  const followingUser = await userModel.findOne({ _id: _user.userId });
  await followerUser.updateOne({ $pull: { following: followingUser._id } });
  await followingUser.updateOne({ $pull: { followers: followerUser._id } });
  try {
    const a1 = await follow.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
};

exports.getMyFollowing = async (req, res) => {
  const user = req.user._id;

  await userModel.findOne({ _id: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result.following);
    }
  });
};
exports.getMyFollowingPopulated = async (req, res) => {
  const user = req.user._id;

  userModel
    .findOne({ _id: user })
    .populate("following")
    .select("following")
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        let tempResult = result.following;
        let arr = [];
        for (let i = 0; i < tempResult.length; i++) {
          let data = {};
          data.data = tempResult[i];
          let pilot = await pilotModel
            .findOne({ userId: tempResult[i]._id })
            .select("pilotType country city userName viewed");
          data.pilot = pilot;
          let shots = await imageModel
            .findOne({ userId: tempResult[i]._id, status: "active" })
            .countDocuments();
          data.shots = shots;
          arr.push(data);
        }
        res.send(arr);
      }
    });
};

exports.singlePilot1 = async (req, res) => {
  const user = req.body.userId;
  try {
    const pilot = await pilotModel.findOne({ userId: user });

    res.send(pilot);
  } catch (err) {
    res.send("please Login");
  }
};

exports.getMyFollowersPopulated = async (req, res) => {
  const user = req.user._id;

  userModel
    .findOne({ _id: user })
    .populate("followers")
    .select("followers")
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        let tempResult = result.followers;
        let arr = [];
        for (let i = 0; i < tempResult.length; i++) {
          let data = {};
          data.data = tempResult[i];
          let pilot = await pilotModel
            .findOne({ userId: tempResult[i]._id })
            .select("pilotType country city userName viewed");
          data.pilot = pilot;
          let shots = await imageModel
            .findOne({ userId: tempResult[i]._id, status: "active" })
            .countDocuments();
          data.shots = shots;
          arr.push(data);
        }
        res.send(arr);
      }
    });
};
///test

exports.getUserFollowing = async (req, res) => {
  const pilotId = req.params.id;
  const _user = await pilotModel.findOne({ userName: pilotId });
  if (_user) {
    await userModel
      .findOne({ _id: _user.userId })
      .populate("following")
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result.following);
        }
      });
  } else {
    res.json({
      data: "noData",
    });
  }
};

exports.getPilotFollowers = async (req, res) => {
  const pilotId = req.params.id;
  const _user = await pilotModel.findOne({ userName: pilotId });
  if (_user) {
    await userModel
      .findOne({ _id: _user.userId })
      .populate("followers")
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result.followers);
        }
      });
  } else {
    res.json({
      data: "noData",
    });
  }
};

exports.unfollow = async (req, res) => {
  const user = req.params.id;
  const id = req.user._id;
  const followerUser = await userModel.findOne({ _id: user });
  const followingUser = await userModel.findOne({ _id: id });
  await followerUser.updateOne({ $pull: { following: followingUser._id } });
  await followingUser.updateOne({ $pull: { followers: followerUser._id } });
  try {
    const a1 = await follow.save();
    res.json(a1);
  } catch (err) {
    res.send(err);
  }
};

exports.unfollow1 = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  const followerUser = await userModel.findOne({ _id: user });
  const followingUser = await userModel.findOne({ _id: id });
  await followerUser.updateOne({ $pull: { following: followingUser._id } });
  await followingUser.updateOne({ $pull: { followers: followerUser._id } });
  try {
    const a1 = await follow.save();
    res.json(a1);
  } catch (err) {
    res.send(err);
  }
};
