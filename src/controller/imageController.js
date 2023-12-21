const imageModel = require("../models/imageModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const Svg = require("./watermark");
const pilotModel = require("../models/pilotModel");
const commentModel = require("../models/commentsModel");
const activityModel = require("../models/activityModel");
const rearrangeModel = require("../models/rearrangeModel");
const keywordsModel = require("../models/keywordsModel");
let ext = crypto.randomBytes(32).toString("hex");
exports.createImage = async (req, res) => {
  console.log(req.body,'oooooooooo')
  console.log(req.file,'file')
  console.log(req.files,'files')
  const user = req.user._id;
  const profilePic = req.user.profilePic;

  const {
    postName,
    fileType,
    category,
    experience,
    keywords,
    rejectReason,
    adult,
  } = req.body;
  const data1 = keywords.split(",");

  console.log(data1);
  //get month and year
  let arr = ["b", "i", "n", "o", "c", "u", "l", "a", "r", "s"];
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  year = String(year);
  let newYear = `${arr[Number(year[0])]}${arr[Number(year[1])]}${
    arr[Number(year[2])]
  }${arr[Number(year[3])]}`;
  let newMonth = ("0" + (month + 1)).slice(-2);
  let thisMonth = `${arr[Number(newMonth[0])]}${arr[Number(newMonth[1])]}`;
  //getting month and year
  // res.send("It is a video")
  //making slug
  let z = Math.floor(1000 + Math.random() * 9000);
  let r = `${z}-`;
  let tempTitle = postName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;
  let myFile = req.file.originalname.split(".");
  const fileType1 = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${newYear}/${thisMonth}/${myFile[0] + ext}${
      fileType == "video" ? `.${fileType1}` : ".jpg"
    }`,
    Body: req.file.buffer,
  };

  s3.upload(params, async (error, data) => {
    if (error) {
      console.log(error,'er')
      res.status(500).send(error);
    }
    console.log(data,'dta')

    const image = new imageModel({
      userId: user,
      name: req.user.name,
      postName,
      fileType: req.body.fileType,
      category,
      file: data.Key,
      experience,
      keywords: data1,
      adult,
      rejectReason,
      status: "active",
      slug: slugtemp,
    });
    try {
      const a1 = await image.save();
      console.log(a1);
      res.json(a1);
      if (a1._id) {
        rearrangeModel
          .find({ userId: req.user._id, fileType: req.body.fileType })
          .exec((err, result) => {
            if (err) {
              console.log(err);
            } else {
              if (result.length == 0) {
              } else {
                let arr = result[0].media;
                arr.push(a1._id);
                rearrangeModel
                  .findOne({
                    userId: req.user._id,
                    fileType: req.body.fileType,
                  })
                  .update({ media: arr })
                  .exec((err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(result);
                    }
                  });
              }
            }
          });
      }
    } catch (err) {
      res.send("error");
    }

    // let buffer = data;
    console.log(data1)
    for(let i=0; i< data1.length ;i++){
      var re = new RegExp(data1[i], "i");
      console.log(re)
      keywordsModel.find({keyword: re}).exec(async(err,result)=>{
        if(err){
          console.log(err)
        }else{
          if(result.length == 0){
            function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            }
            let temp = capitalizeFirstLetter(data1[i])
            const _industry = new keywordsModel({
              keyword: temp
              });
              try {
                const a1 = await _industry.save();
                console.log(a1)
              } catch (err) {
                console.log(err)
              }
          }else{
            console.log(result)
          }
         
        }
      })
    }
  });
};

exports.getImages = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 20;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < (await imageModel.countDocuments().exec())) {
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
  imageModel
    .find({ status: "active" })
    .limit(limit)
    .skip(startIndex)
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        results.results = result;
        res.send(results);
      }
    });
};

exports.getPendingImages = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "pending", fileType: "image" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getApprovedImages = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "active", fileType: "image" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getRejectedImages = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "rejected", fileType: "image" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getPendingVideos = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "pending", fileType: "video" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getApprovedVideos = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "active", fileType: "video" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getRejectedVideos = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "rejected", fileType: "video" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getPending3d = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "pending", fileType: "3d" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getApproved3d = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "active", fileType: "3d" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getRejected3d = async (req, res) => {
  const user = req.user._id;

  imageModel
    .find({ userId: user, status: "rejected", fileType: "3d" })
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.deleteImage = async (req, res) => {
  let id = req.params.id;
  imageModel.findOne({ _id: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result._id) {
        rearrangeModel
          .find({ userId: result.userId, fileType: result.fileType })
          .exec((err, result) => {
            if (err) {
              console.log(err);
            } else {
              if (result.length !== 0) {
                console.log("Iam rearranged");
                let arr = result[0].media;
                arr = arr.filter((item) => item !== id);
                rearrangeModel
                  .findOne({
                    userId: result[0].userId,
                    fileType: result[0].fileType,
                  })
                  .updateOne({ media: arr })
                  .exec((err, result) => {
                    if (err) {
                    } else {
                    }
                  });
              }

              imageModel.findOne({ _id: id }).deleteOne((err, result) => {
                if (err) {
                  res.send(err);
                } else {
                  res.send(result);
                }
              });
            }
          });
      }
    }
  });
};

exports.getImage = async (req, res) => {
  id = req.params.id;
  imageModel.find({ _id: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.getUserImages = async (req, res) => {
  id = req.params.id;
  imageModel
    .find({ userId: id, status: "active" })
    .sort({ createdAt: -1 })

    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.likeImage = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  console.log(id, user);
  try {
    const _user = await userModel
      .findOne({ _id: user })
      .updateOne({ $push: { likedMedia: id } });

    await imageModel.findById(id).updateOne({ $push: { likes: user } });
    res.send("Liked Successfully");
  } catch (err) {
    res.send("please Login");
  }
  imageModel
    .findById(id)
    .update({ $inc: { likedCount: 1 } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  const activity = new activityModel({
    name: "like",
    userId: user,
    link: `/image/${id}`,
    imageId: id,
  });
  try {
    const a1 = await activity.save();
    console.log(a1);
  } catch (err) {
    console.log(err);
  }
};

exports.unlikeImage = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  console.log(id, user);
  try {
    const _user = await userModel
      .findOne({ _id: user })
      .updateOne({ $pull: { likedMedia: id } });

    await imageModel.findById(id).updateOne({ $pull: { likes: user } });
    res.send("unliked Successfully");
  } catch (err) {
    res.send("please Login");
  }
  imageModel
    .findById(id)
    .update({ $inc: { likedCount: -1 } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
};

exports.downloadImage = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  const Image = await imageModel.findById(id);
  if (Image.downloads.includes(user)) {
    res.send("Already Downloaded");
  } else {
    console.log(Image);
    try {
      const _user = await userModel
        .findOne({ _id: user })
        .updateOne({ $push: { downloadedMedia: id } });

      await imageModel.findById(id).updateOne({ $push: { downloads: user } });
      res.send("Downloaded Successfully");
    } catch (err) {
      res.send("please Login");
    }
  }
  imageModel
    .findById(id)
    .update({ $inc: { downloadCount: 1 } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
};

exports.imageFilters = async (req, res) => {
  const data = req.body.data;
  const type = req.body.type;
  if (type === "all") {
    var re = new RegExp(data, "i");
    //paggination
    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ status: "active" })
        .or([{ keywords: { $regex: re } }, { postName: { $regex: re } }])
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

    //paggination

    imageModel
      .find({ status: "active" })
      .or([{ keywords: { $regex: re } }, { postName: { $regex: re } }])
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  } else {
    var re = new RegExp(data, "i");

    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ fileType: type, status: "active" })
        .or([{ keywords: { $regex: re } }, { postName: { $regex: re } }])
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

    imageModel
      .find({ fileType: type, status: "active" })
      .or([{ keywords: { $regex: re } }, { postName: { $regex: re } }])
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  }
};

exports.editImage = async (req, res) => {
  const keywords1 = req.body.keywords.split(",");

  const user = req.user._id;
  const profilePic = req.user.profilePic;
  //get month and year
  let arr = ["b", "i", "n", "o", "c", "u", "l", "a", "r", "s"];
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  year = String(year);
  let newYear = `${arr[Number(year[0])]}${arr[Number(year[1])]}${
    arr[Number(year[2])]
  }${arr[Number(year[3])]}`;
  let newMonth = ("0" + (month + 1)).slice(-2);
  let thisMonth = `${arr[Number(newMonth[0])]}${arr[Number(newMonth[1])]}`;

  //getting month and year

  const {
    postName,
    fileType,
    category,
    experience,
    keywords,
    rejectReason,
    adult,
  } = req.body;
  console.log(req.body.fileType);
  let z = Math.floor(1000 + Math.random() * 9000);
  let r = `${z}-`;
  let tempTitle = postName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;
  //delete Old Image
  const imageId = req.params.id;
  imageModel.findByIdAndDelete(imageId, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted12345");
    }
  });
  //delete old image
  rearrangeModel
    .find({ userId: user, fileType: fileType })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length !== 0) {
          let arr = result[0].media;
          arr = arr.filter((item) => item !== imageId);
          rearrangeModel
            .findOne({ userId: result[0].userId, fileType: result[0].fileType })
            .updateOne({ media: arr })
            .exec((err, result) => {
              if (err) {
              } else {
              }
            });
        }
      }
    });

  // res.send("It is a video")

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;
  let myFile = req.file.originalname.split(".");
  const fileType1 = myFile[myFile.length - 1];

  const params2 = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${newYear}/${thisMonth}/${myFile[0] + ext}${
      fileType == "video" ? `.${fileType1}` : ".jpg"
    }`,
    Body: req.file.buffer,
  };

  s3.upload(params2, (error, data) => {
    if (error) {
      console.log(err);
    }

    // res.status(200).send(data)
  });

  s3.upload(params2, async (error, data) => {
    if (error) {
      console.log(err);
    }
    const image = new imageModel({
      userId: user,
      name: req.user.name,
      postName,
      fileType: req.body.fileType,
      category,
      file: data.key,
      experience,
      keywords: keywords1,
      adult,
      rejectReason,
      status: "active",
      slug: slugtemp,
    });
    try {
      const a1 = await image.save();
      res.json(a1);
      console.log(a1);
      if (a1._id) {
        rearrangeModel
          .find({ userId: a1.userId, fileType: a1.fileType })
          .exec((err, result) => {
            if (err) {
              console.log(err);
            } else {
              if (result.length !== 0) {
                console.log("I am rearrange edit");
                let arr = result[0].media;
                arr.push(a1._id);
                rearrangeModel
                  .findOne({
                    userId: result[0].userId,
                    fileType: result[0].fileType,
                  })
                  .updateOne({ media: arr })
                  .exec((err, result) => {
                    if (err) {
                    } else {
                    }
                  });
              }
            }
          });
      }
    } catch (err) {
      // res.send("error");
    }

    // res.status(200).send(data)
  });
};

exports.editImage1 = async (req, res) => {
  const user = req.user._id;
  const profilePic = req.user.profilePic;

  const {
    postName,
    fileType,
    category,
    experience,
    keywords,
    rejectReason,
    adult,
    file,
  } = req.body;

  const imageId = req.params.id;
  imageModel.findByIdAndDelete(imageId, async (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted ");
      rearrangeModel
        .find({ userId: user, fileType: fileType })
        .exec((err, result) => {
          if (err) {
            console.log(err);
          } else {
            if (result.length !== 0) {
              let arr = result[0].media;
              arr = arr.filter((item) => item !== imageId);

              rearrangeModel
                .findOne({
                  userId: result[0].userId,
                  fileType: result[0].fileType,
                })
                .updateOne((err, result) => {
                  if (err) {
                  } else {
                  }
                });
            }
          }
        });
    }
  });
  let z = Math.floor(1000 + Math.random() * 9000);
  let r = `${z}-`;
  let tempTitle = postName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .join("-");
  let slugtemp = r + tempTitle;
  const image = new imageModel({
    userId: user,
    name: req.user.name,
    postName,
    fileType: req.body.fileType,
    category,
    file: req.body.file,
    experience,
    keywords,
    adult,
    rejectReason,
    profilePic,
    status: "active",
    slug: slugtemp,
  });
  try {
    const a1 = await image.save();
    res.json(a1);

    if (a1._id) {
      console.log(a1._id);
      rearrangeModel
        .find({ userId: a1.userId, fileType: a1.fileType })
        .exec(async (err, result) => {
          if (err) {
            console.log(err);
          } else {
            if (result.length !== 0) {
              console.log("I am rearrange edit2");
              let arr = result[0].media;
              arr.push(a1._id);
              console.log(arr);
              await rearrangeModel
                .findOne({
                  userId: result[0].userId,
                  fileType: result[0].fileType,
                })
                .updateOne({ media: arr })
                .exec((err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                  }
                });
            }
          }
        });
    }
  } catch (err) {
    res.send("error");
  }
};

exports.findImage = async (req, res) => {
  const { userId, imageId } = req.body;
  imageModel.findOne({ userId: userId, _id: imageId }).exec((err, result) => {
    if (err) {
      res.send("No Image");
    } else {
      res.send(result);
    }
  });
};

exports.getUserImagesOnly = async (req, res) => {
  id = String(req.params.id);
  pilotModel.findOne({ userName: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        pilotModel.findOne({ _id: result._id }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result);
            imageModel
              .find({
                userId: result.userId,
                status: "active",
                fileType: "image",
              })
              .sort({ createdAt: -1 })

              .exec((err, result) => {
                if (err) {
                  res.send(err);
                } else {
                  res.send(result);
                }
              });
          }
        });
      } else {
        res.json({
          data: "noData",
        });
      }
    }
  });
};

exports.getUser3dOnly = async (req, res) => {
  id = String(req.params.id);
  pilotModel.findOne({ userName: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        pilotModel.findOne({ _id: result._id }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result);
            imageModel
              .find({ userId: result.userId, status: "active", fileType: "3d" })
              .sort({ createdAt: -1 })

              .exec((err, result) => {
                if (err) {
                  res.send(err);
                } else {
                  res.send(result);
                }
              });
          }
        });
      } else {
        res.json({
          data: "noData",
        });
      }
    }
  });
};

exports.getUserVideosOnly = async (req, res) => {
  id = String(req.params.id);
  pilotModel.findOne({ userName: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        pilotModel.findOne({ _id: result._id }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result);
            imageModel
              .find({
                userId: result.userId,
                status: "active",
                fileType: "video",
              })
              .sort({ createdAt: -1 })

              .exec((err, result) => {
                if (err) {
                  res.send(err);
                } else {
                  res.send(result);
                }
              });
          }
        });
      } else {
        res.json({
          data: "noData",
        });
      }
    }
  });
};

exports.getFollowersMedia = async (req, res) => {
  const user = req.user._id;
  const page = parseInt(req.query.page);
  const limit = 20;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (
    endIndex <
    (await imageModel
      .find({ userId: req.user.following, status: "active" })
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

  imageModel
    .find({ userId: req.user.following, status: "active" })
    .limit(limit)
    .skip(startIndex)
    .sort({ createdAt: -1 })

    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        results.results = result;
        res.send(results);
      }
    });
};

exports.getUser = async (req, res) => {
  const id = req.params.id;
  imageModel.findById(id).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      userModel.findById(result.userId).exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    }
  });
};

exports.viewImage = async (req, res) => {
  let id = req.params.id;
  imageModel
    .findById(id)
    .update({ $inc: { views: 1 } })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getSortingImages = async (req, res) => {
  const User = req.user._id;
  await imageModel
    .find({ userId: User, status: "active" })
    .sort({ createdAt: -1 })
    .select("file fileType")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getGoodImages = async (req, res) => {
  await userModel
    .find({ pilotPro: true })
    .distinct("_id")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        imageModel
          .find({ userId: result })
          .sort({ views: -1 })
          .limit(30)
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

exports.getNextImage = async (req, res) => {
  let { currentId } = req.body;
  // Post.findOne({,_id: {$lt: curId}}).sort({_id: -1}).exec(cb)
  imageModel.findOne({ slug: currentId }).exec((err, result1) => {
    if (err) {
      res.send(err);
    } else {
      imageModel
        .findOne({ status: "active", _id: { $lt: result1._id } })
        .sort({ _id: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            if (result === null) {
              imageModel
                .findOne({ status: "active" })
                .sort({ createdAt: -1 })
                .exec((err, result1) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.send(result1);
                  }
                });
            } else {
              res.send(result);
            }
          }
        });
    }
  });
};
exports.getPreviousImage = async (req, res) => {
  let { currentId } = req.body;
  imageModel.findOne({ slug: currentId }).exec((err, result1) => {
    if (err) {
      res.send(err);
    } else {
      imageModel
        .findOne({ status: "active", _id: { $gt: result1._id } })
        .sort({ _id: 1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            console.log(result);
            if (result === null) {
              imageModel
                .findOne({ status: "active" })
                .sort({ createdAt: 1 })
                .exec((err, result1) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.send(result1);
                  }
                });
            } else {
              res.send(result);
            }
          }
        });
    }
  });
};
exports.getRelatedImages = async (req, res) => {
  let { keywords, category } = req.body;
  console.log(req.body);
  keywords.push(category);
  let regex1 = keywords.join("|");
  imageModel
    .find({ status: "active" })
    .or([
      { keywords: { $regex: regex1 } },
      { category: { $regex: regex1 } },
      { postName: { $regex: regex1 } },
    ])
    .limit(8)
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getPopupImage = async (req, res) => {
  const { id } = req.body;
  await imageModel.findOne({ _id: id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.getNextPopupImage = async (req, res) => {
  let { currentId, id } = req.body;
  // Post.findOne({,_id: {$lt: curId}}).sort({_id: -1}).exec(cb)
  imageModel
    .findOne({ userId: id, status: "active", _id: { $gt: currentId } })
    .sort({ _id: 1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result === null) {
          res.send("Last Image");
        } else {
          res.send(result);
        }
      }
    });
};
exports.getPreviousPopupImage = async (req, res) => {
  let { currentId, id } = req.body;
  // Post.findOne({,_id: {$lt: curId}}).sort({_id: -1}).exec(cb)
  imageModel
    .findOne({ userId: id, status: "active", _id: { $lt: currentId } })
    .sort({ _id: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result === null) {
          res.send("Last Image");
        } else {
          res.send(result);
        }
      }
    });
};

exports.imageView = async (req, res) => {
  const id = req.params.id;
  let media = ["3d", "image"];
  await imageModel
    .findOne({ slug: id })
    .populate("userId")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result) {
          let imageData = result;
          imageModel
            .find({ fileType: media, userId: result.userId })
            .sort({ createdAt: -1 })
            .limit(6)
            .exec((err, result1) => {
              if (err) {
                res.send(err);
              } else {
                let otherImages = result1;
                commentModel
                  .find({ imageId: result._id })
                  .sort({ createdAt: -1 })
                  .populate("userId")
                  .exec((err, result2) => {
                    if (err) {
                      res.send(err);
                    } else {
                      let comments = result2;
                      let keywords = result.keywords;
                      let category = result.category;
                      keywords.push(category);
                      let regex1 = keywords.join("|");
                      imageModel
                        .find({ fileType: media, status: "active" })
                        .or([
                          { keywords: { $regex: regex1 } },
                          { category: { $regex: regex1 } },
                          { postName: { $regex: regex1 } },
                        ])
                        .limit(8)
                        .sort({ createdAt: -1 })
                        .exec((err, result3) => {
                          if (err) {
                            res.send(err);
                          } else {
                            let relatedImages = result3;
                            res.send({
                              imageData,
                              otherImages,
                              comments,
                              relatedImages,
                            });
                          }
                        });
                    }
                  });
              }
            });
        } else {
          res.json({ data: "no image" });
        }
      }
    });
};
exports.homePage = async (req, res) => {
  console.log("============================================================")
  console.log("Ëntered")
  console.log("=============================================")



  const activeImages = await imageModel.aggregate([
  {
    $match: { status: "active" }
  },
  {
    $lookup: {
      from: "users", // Replace 'users' with the actual name of the user collection
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $match: { "user.deactivate": { $ne: true } }
  }
]);


  
  const { type, keyword } = req.body;
  if (!keyword && !req.body.data) {
    if (type == "all") {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel.find({ status: "active" }).countDocuments().exec())
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
      imageModel
        .find({ status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active", type })
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
      imageModel
        .find({ status: "active", fileType: type })
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
  if (keyword == "liked" && !req.body.data) {
    if (type == "all") {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active" })
          .sort({ likedCount: -1 })
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
      imageModel
        .find({ status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ likedCount: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active", fileType: type })
          .sort({ likedCount: -1 })
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
      imageModel
        .find({ status: "active", fileType: type })
        .limit(limit)
        .skip(startIndex)
        .sort({ likedCount: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
  if (keyword == "recommended" && !req.body.data) {
    if (type == "all") {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel.find({ recommended: true, status: "active" }).countDocuments().exec())
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
      imageModel
        .find({ recommended: true, status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ recommended: true, fileType: type })
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
      imageModel
        .find({ recommended: true, fileType: type, status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
  if (keyword == "viewed" && !req.body.data) {
    if (type == "all") {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active" })
          .sort({ views: -1 })
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
      imageModel
        .find({ status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ views: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active", fileType: type })
          .sort({ views: -1 })
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
      imageModel
        .find({ status: "active", fileType: type })
        .limit(limit)
        .skip(startIndex)
        .sort({ views: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
  if (keyword == "commented" && !req.body.data) {
    if (type == "all") {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active" })
          .sort({ commentCount: -1 })
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
      imageModel
        .find({ status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ commentCount: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active", fileType: type })
          .sort({ commentCount: -1 })
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
      imageModel
        .find({ status: "active", fileType: type })
        .limit(limit)
        .skip(startIndex)
        .sort({ commentCount: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
  if (keyword == "downloaded" && !req.body.data) {
    if (type == "all") {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active" })
          .sort({ downloadCount: -1 })
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
      imageModel
        .find({ status: "active" })
        .limit(limit)
        .skip(startIndex)
        .sort({ downloadCount: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active", fileType: type })
          .sort({ downloadCount: -1 })
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
      imageModel
        .find({ status: "active", fileType: type })
        .limit(limit)
        .skip(startIndex)
        .sort({ downloadCount: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
  //following
  if (keyword == "following" && !req.body.data) {
    if (req.body.token) {
      let token = req.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let usermain = await userModel.findById(decoded.id).select("-password");
      if (type == "all") {
        const page = parseInt(req.query.page);
        const limit = 20;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (
          endIndex <
          (await imageModel
            .find({ status: "active", userId: usermain.following })
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
        imageModel
          .find({ status: "active", userId: usermain.following })
          .limit(limit)
          .skip(startIndex)
          .exec((err, result) => {
            if (err) {
              res.send(err);
            } else {
              results.results = result;
              res.send(results);
            }
          });
      } else {
        const page = parseInt(req.query.page);
        const limit = 20;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (
          endIndex <
          (await imageModel
            .find({
              status: "active",
              fileType: type,
              userId: usermain.following,
            })
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
        imageModel
          .find({
            status: "active",
            fileType: type,
            userId: usermain.following,
          })
          .limit(limit)
          .skip(startIndex)
          .sort({ createdAt: -1 })
          .exec((err, result) => {
            if (err) {
              res.send(err);
            } else {
              results.results = result;
              res.send(results);
            }
          });
      }
    } else {
      res.send("Send Token");
    }
  }
  if (req.body.data) {
    // console.log(req.body.data);
    const data = req.body.data;
    const type = req.body.type;
    if (type === "all") {
      var re = new RegExp(data, "i");
      //paggination
      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ status: "active" })
          .or([
            { keywords: { $regex: re } },
            { postName: { $regex: re } },
            { fileType: { $regex: re } },
          ])
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

      //paggination

      imageModel
        .find({ status: "active" })
        .or([
          { keywords: { $regex: re } },
          { postName: { $regex: re } },
          { fileType: { $regex: re } },
        ])
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    } else {
      var re = new RegExp(data, "i");

      const page = parseInt(req.query.page);
      const limit = 20;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if (
        endIndex <
        (await imageModel
          .find({ fileType: type, status: "active" })
          .or([{ keywords: { $regex: re } }, { postName: { $regex: re } }])
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

      imageModel
        .find({ fileType: type, status: "active" })
        .or([{ keywords: { $regex: re } }, { postName: { $regex: re } }])
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            results.results = result;
            res.send(results);
          }
        });
    }
  }
};

exports.getSearchImages = async (req, res) => {
  let temp = req.body.data.split(" ");
  let regex1 = temp.join("|");
  if (req.body.sort == "all") {
    var re = new RegExp(regex1, "i");

    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ status: "active" })
        .or([
          { keywords: { $regex: re } },
          { postName: { $regex: re } },
          { category: { $regex: re } },
        ])
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

    imageModel
      .find({ status: "active" })
      .or([
        { keywords: { $regex: re } },
        { postName: { $regex: re } },
        { category: { $regex: re } },
      ])
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  }
  if (req.body.sort == "downloads") {
    var re = new RegExp(regex1, "i");

    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ status: "active" })
        .or([
          { keywords: { $regex: re } },
          { postName: { $regex: re } },
          { category: { $regex: re } },
        ])
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

    imageModel
      .find({ status: "active" })
      .or([
        { keywords: { $regex: re } },
        { postName: { $regex: re } },
        { category: { $regex: re } },
      ])
      .limit(limit)
      .skip(startIndex)
      .sort({ downloadCount: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  }
  if (req.body.sort == "likes") {
    var re = new RegExp(regex1, "i");

    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ status: "active" })
        .or([
          { keywords: { $regex: re } },
          { postName: { $regex: re } },
          { category: { $regex: re } },
        ])
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

    imageModel
      .find({ status: "active" })
      .or([
        { keywords: { $regex: re } },
        { postName: { $regex: re } },
        { category: { $regex: re } },
      ])
      .limit(limit)
      .skip(startIndex)
      .sort({ likedCount: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  }
  if (req.body.sort == "comments") {
    var re = new RegExp(regex1, "i");

    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ status: "active" })
        .or([
          { keywords: { $regex: re } },
          { postName: { $regex: re } },
          { category: { $regex: re } },
        ])
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

    imageModel
      .find({ status: "active" })
      .or([
        { keywords: { $regex: re } },
        { postName: { $regex: re } },
        { category: { $regex: re } },
      ])
      .limit(limit)
      .skip(startIndex)
      .sort({ commentCount: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  }
  if (req.body.sort == "views") {
    var re = new RegExp(regex1, "i");

    const page = parseInt(req.query.page);
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (
      endIndex <
      (await imageModel
        .find({ status: "active" })
        .or([
          { keywords: { $regex: re } },
          { postName: { $regex: re } },
          { category: { $regex: re } },
        ])
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

    imageModel
      .find({ status: "active" })
      .or([
        { keywords: { $regex: re } },
        { postName: { $regex: re } },
        { category: { $regex: re } },
      ])
      .limit(limit)
      .skip(startIndex)
      .sort({ views: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          results.results = result;
          res.send(results);
        }
      });
  }
  if (!req.body.sort || !req.body.data) {
    res.send("Invalid request");
  }
};

exports.test = async (req, res) => {
  let arr = ["b", "i", "n", "o", "c", "u", "l", "a", "r", "s"];
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  year = String(year);
  let newYear = `${arr[Number(year[0])]}${arr[Number(year[1])]}${
    arr[Number(year[2])]
  }${arr[Number(year[3])]}`;
  let newMonth = ("0" + (month + 1)).slice(-2);
  let thisMonth = `${arr[Number(newMonth[0])]}${arr[Number(newMonth[1])]}`;
  res.status(200).json({ year: newYear, month: thisMonth });
};
