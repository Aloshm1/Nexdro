const activityModel = require("../models/activityModel");
const pilotModel = require("../models/pilotModel");
const reviewModel = require("../models/reviewModel");
const Review = require("../models/reviewModel");
const service_centerModel = require("../models/service_centerModel");
const userModel = require("../models/userModel");

exports.createReview = async (req, res) => {
  const { pilotProfile, pilotName, rating, review, likes, shares, centerId } =
    req.body;
  const _review = new Review({
    pilotProfile,
    pilotName,
    rating,
    review,
    likes,
    shares,
    centerId,
  });
  try {
    const a1 = await _review.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
};

// exports.getReview = async (req, res) => {
//   const id = req.params.id;
//   const page = parseInt(req.query.page)
//       const limit = 15;

//       const startIndex = (page - 1) * limit
//       const endIndex = page * limit

//       const results = {}
//       let temp = await Review.find({ centerId: id }).countDocuments().exec()
//       if (endIndex < temp) {
//         results.next = {
//           page: page + 1,
//           limit: limit
//         }
//       }

//       if (startIndex > 0) {
//         results.previous = {
//           page: page - 1,
//           limit: limit
//         }
//       }
//   Review.find({ centerId: id }).limit(limit).skip(startIndex)
//     .sort({ createdAt: -1 }).populate("userId")
//     .exec((err, result) => {
//       if (err) {
//         res.send(err);
//       } else {
//         results.results = result
//         res.send(result);
//       }
//     });
// };
exports.getReview = async (req, res) => {
  const id = req.params.id;
  const page = parseInt(req.query.page);

  Review.find({ centerId: id })
    .sort({ createdAt: -1 })
    .populate("userId")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.writeReview = async (req, res) => {
  const centerId = req.params.id;
  const user = req.user._id;

  const { rating, review, likes, shares } = req.body;

  console.log(rating,'rting')
 
  const _review = new Review({
    rating,
    review,
    likes,
    centerId,
    pilotName: req.user.name,
    userId: user,
  });
  try {
    const a1 = await _review.save();
    

    var usersProjection = {
      __v: false,
      _id: false,
    };
    Review.find({ centerId: centerId }, usersProjection).exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
       
        const data=result.filter((item)=>{
           return item.rating!=0
        })
        console.log(data.length,'oop')
  
        const average =
          data.reduce((total, next) => total + next.rating, 0) /
          data.length;
        console.log(average);

        service_centerModel
        .findByIdAndUpdate(centerId, { rating: average }, { new: true })
        .exec((err, updatedCenter) => {
          if (err) {
            console.log(err);
          } else {
            
            console.log("Successfully updated");
            res.send(updatedCenter); 
          }
        });
      
      }
    });
  } catch (err) {
    res.send("error");
  }
  const activity = new activityModel({
    name: "review",
    userId: user,
    link: `/service-center/${centerId}`,
    centerId: centerId,
  });
  try {
    const a1 = await activity.save();
    console.log(a1)
  } catch (err) {
    console.log(err)
  }
};

exports.likeReview = async (req, res) => {
  const reviewId = req.body.reviewId;
  const user = req.user._id;
  const review = await reviewModel.findOne({ _id: reviewId });

  // console.log(id, user);
  try {
    await reviewModel
      .find({ _id: reviewId })
      .updateOne({ $push: { likes: user } });
    await userModel
      .find({ _id: user })
      .updateOne({ $push: { likedReviews: reviewId } });
  } catch (err) {
    res.send(err);
  }
  res.send(review);
  console.log(user);
};

exports.unlikeReview = async (req, res) => {
  const reviewId = req.body.reviewId;
  const user = req.user._id;
  const review = await reviewModel.findOne({ _id: reviewId });

  // console.log(id, user);
  try {
    await reviewModel
      .find({ _id: reviewId })
      .updateOne({ $pull: { likes: user } });
    await userModel
      .find({ _id: user })
      .updateOne({ $pull: { likedReviews: reviewId } });
  } catch (err) {
    res.send(err);
  }
  res.send(review);
  console.log(user);
};

exports.getReviews = async (req, res) => {
  const id = req.params.id;

  var usersProjection = {
    __v: false,
    _id: false,
  };

  const page = parseInt(req.query.page);
  const limit = 15;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (
    endIndex <
    (await Review.find({ centerId: id }, usersProjection)
      .countDocuments()
      .exec())
  ) {
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
  Review.find({ centerId: id }, usersProjection).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      results.results = result;
      res.send(results);
      //   const average = result.reduce((total, next) => total + next.rating, 0)/result.length
      // console.log(average)
    }
  });
};

exports.getSample = async (req, res) => {
  await reviewModel
    .find({})
    .distinct("_id")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};
