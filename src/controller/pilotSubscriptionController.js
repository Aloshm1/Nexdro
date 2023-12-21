const imageModel = require("../models/imageModel");
const pilotSubscriptionModel = require("../models/pilotSubscriptionModel");
const userModel = require("../models/userModel");
const stripe = require('stripe')('sk_test_51KqxC0SBkY4kbyYODyFDUhqKC9QLIVG9vSwy4CY8H59UoE0KdGjF5RRsKh91ONWRoFwmMSOs7POhvrPXHqQONU4k008UjnaguX');
const pilotModel = require("../models/pilotModel");
const draftImageModel = require("../models/draftImageModel");

exports.createSubscription = async (req, res) => {
  let { plan, paymentId, images, videos, images3d } = req.body;
  const userId = req.user._id;
  await pilotSubscriptionModel
    .deleteMany({ userId: userId })
    .exec( async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (plan.includes("Gold")) {
          (images = 15), (videos = 3), (images3d = 3);
        } else {
          (images = 30), (videos = 6), (images3d = 5);
        }
        const _industry = new pilotSubscriptionModel({
          userId,
          plan,
          paymentId,
          images,
          videos,
          images3d,
        });
        try {
          const a1 = await _industry.save();
          await userModel
            .findOne({ _id: userId })
            .update({ pilotPro: true })
            .exec((err, result) => {
              if (err) {
                res.send(err);
              } else {
                pilotModel
                  .findOne({ userId: userId })
                  .update({ pilotPro: true })
                  .exec((err, result1) => {
                    if (err) {
                      res.send(err);
                    } else {
                      res.send(a1);
                    }
                  });
              }
            });
        } catch (err) {
          res.send(err);
        }
        console.log(result);
      }
    });
 

  
};

exports.getMySubscription = (req, res) => {
  const _user = req.user._id;
  pilotSubscriptionModel
    .findOne({ userId: _user })
    .exec(async (err, result1) => {
      if (err) {
        res.send(err);
      } else {
        const images = await imageModel.count({
          fileType: "image",
          userId: _user,
          status: ["active", "pending"],
        });

        const videos = await imageModel.count({
          fileType: "video",
          userId: _user,
          status: ["active", "pending"],
        });
        const images3d = await imageModel.count({
          fileType: "3d",
          userId: _user,
          status: ["active", "pending"],
        });
        const draftimages = await draftImageModel.count({
          fileType: "image",
          userId: _user,
        });

        const draftvideos = await draftImageModel.count({
          fileType: "video",
          userId: _user,
        });
        const draftimages3d = await draftImageModel.count({
          fileType: "3d",
          userId: _user,
        });
        res.json({
          images: images + draftimages,
          videos: videos + draftvideos,
          images3d: images3d + draftimages3d,
          subscription: result1,
          isPro: req.user.pilotPro,
        });
      }
    });
};

exports.getMySubscriptionData = async (req, res) => {
  const _user = req.user._id;
  pilotSubscriptionModel
    .findOne({ userId: _user })
    .exec(async (err, result1) => {
      console.log(result1)
      if (err) {
        res.send(err);
      } else {
        const images = await imageModel.count({
          fileType: "image",
          userId: _user,
          status: ["active", "pending"],
        });

        const videos = await imageModel.count({
          fileType: "video",
          userId: _user,
          status: ["active", "pending"],
        });
        const images3d = await imageModel.count({
          fileType: "3d",
          userId: _user,
          status: ["active", "pending"],
        });
        const draftimages = await draftImageModel.count({
          fileType: "image",
          userId: _user,
        });

        const draftvideos = await draftImageModel.count({
          fileType: "video",
          userId: _user,
        });
        const draftimages3d = await draftImageModel.count({
          fileType: "3d",
          userId: _user,
        });
        if(result1){
          const subscription = await stripe.subscriptions.retrieve(
            result1.paymentId
          );
          res.json({
            images: images + draftimages,
            videos: videos + draftvideos,
            images3d: images3d + draftimages3d,
            price: subscription.plan.amount,
            status: subscription.status,
            startDate: subscription.current_period_start,
           currency : subscription.plan.currency,
            endDate: subscription.current_period_end,
            sub: result1,
            isPro: req.user.pilotPro,
          });
        }
        else{
          res.send("No Subscription")
        }
        
 
      }
    });
};

exports.endSubscription  = async (req,res)=>{
  const User = req.user._id;
  pilotSubscriptionModel.findOne({userId: User}).exec(async (err, result)=>{
    if(err){
      res.send(err)
    }else{
     let subscriptionId = result.paymentId;

const deleted = await stripe.subscriptions.del(
  subscriptionId
);
if(deleted.status === "canceled"){
  pilotSubscriptionModel.deleteOne({userId: User}).exec((err, result)=>{
    if(err){
      res.send(err)
    }else{
      userModel.findOne({_id: User}).update({pilotPro: false}).exec((err, result)=>{
        if(err){
          res.send(err)
        }else{
          pilotModel.findOne({userId: User}).update({pilotPro: false}).exec((err, resultFinal)=>{
            if(err){
              res.send(err)
            }else{
              res.send("Cancelled Finally")
            }
          })
        }
      })
    }
  })
}
    }
  })
}