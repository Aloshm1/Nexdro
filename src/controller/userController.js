const crypto = require("crypto");
const sharp = require("sharp");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");

const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const pilotModel = require("../models/pilotModel.js");
const companyModel = require("../models/companyModel.js");
const service_centerModel = require("../models/service_centerModel.js");
const mailTokenModel = require("../models/mailTokenModel.js");
const sendMailVerify = require("../../utils/sendMail.js");
const mailSend= require("../../utils/mailSend.js")
const userModel = require("../models/userModel.js");
const passwordRecoverModel = require("../models/passwordRecoverModel.js");
const ipModel = require("../models/ipModel.js");
const jobAlertsModel = require("../models/jobAlertsModel.js");
const chatModel = require("../models/chatModel.js");
let ext = crypto.randomBytes(32).toString("hex");

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNo, password, role, roleId, country } = req.body;
  console.log(req.body,'bfy')

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phoneNo,
    role,
    roleId,
    country,
  });

  if (user) {
    //mail verify

    const mailToken = await new mailTokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    try {
      const a1 = await mailToken.save();
      if (a1.token) {
        const url = `${process.env.BASE_URL}/user/${user._id}/verify/${mailToken.token}`;
        var mailOptions = {
          from: 'no-reply@nexdro.com',
          to: user.email,
          subject: 'Nexdro Email Verification',
          template: 'register',
          context: {
            name: user.name,
            email: user.email,
            link: url
          }
        
        };
        await mailSend(mailOptions)
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verify: user.verify,
          token: generateToken(user._id, user.roleId),
        });
      }
    } catch (err) {
      res.send("error");
    }
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  console.log(req.body,'pass')
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });
  if(user){
   

    bcrypt.compare(password,user.password).then((match)=>{
      if(match){
          User.findByIdAndUpdate(user._id,{deactivate:false},{new:true,upsert:true}).then((response)=>{
            pilotModel.findOneAndUpdate({userId:user._id},{deactivate:false},{new:true,upsert:true}).then((response)=>{
              res.json({
                _id: user._id,
                email: user.email,
                roleId: user.roleId,
                role: user.role,
                token: generateToken(user._id, user.roleId),
                verify: user.verify,
              
            })
            })
          })
        
 
         
     
       
      }else{
        res.status(400).send('Invalid Password')
       
      }
    })
    console.log("Success")
  }else{
    res.status(400).send('Email not Found')
  }

 
});

const generateToken = (id, roleId) => {
  return jwt.sign({ id, roleId }, process.env.JWT_SECRET, {
    expiresIn: "20000d",
  });
};

exports.checkEmail = async (req, res) => {
  const email = req.body.email;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send("User already exists");
  } else {
    res.status(200).send("User email available");
  }
};
exports.checkPhoneNo = async (req, res) => {
  const phoneNo = req.body.phoneNo;
  const userExists = await User.findOne({ phoneNo, country: req.body.country });

  if (userExists) {
    res.status(400).send("User already exists");
  } else {
    res.status(200).send("User phoneNo available");
  }
};

exports.checkPilot = async (req, res) => {
  const user = req.user._id;
  const pilot = await pilotModel.findOne({ userId: user });

  if (pilot) {
    res.status(200).send("Pilot already exists");
  } else {
    res.status(400).send("Pilot account not there");
  }
};
exports.checkCompany = async (req, res) => {
  const user = req.user._id;
  const company = await companyModel.findOne({ userId: user });

  if (company) {
    res.status(200).send("company already exists");
  } else {
    res.status(400).send("company account not there");
  }
};
exports.checkCenter = async (req, res) => {
  const user = req.user._id;
  const center = await service_centerModel.findOne({ _id: user });

  if (center) {
    res.status(200).send("center already exists");
  } else {
    res.status(400).send("center account not there");
  }
};

exports.verifyMail = async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });
  if (!user) {
    req.status(404).json({
      message: "User Doesnt exists",
    });
  }
  const token = await mailTokenModel
    .find({
      userId: user._id,
      token: req.params.token,
    })
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length == 0) {
          res.status(200).json({
            message: "No token available",
          });
        } else {
          await user.updateOne({ verify: true });
          res.send({
            token: generateToken(user._id, user.roleId),
            role: user.role,
            verify: user.verify,
          });
        }
      }
    });
};

exports.forgetPassword = async (req, res) => {
  let email = req.body.email;
  console.log(req.body);
  const user = await userModel.findOne({ email: email });
  if (!user) {
    res.send("invalid email");
  } else {
    console.log(user);
    const mailToken = await new passwordRecoverModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}/user/${user._id}/recover/${mailToken.token}`;
    var mailOptions = {
      from: 'alosh.nexevo@gmail.com',
      to: user.email,
      subject: 'Password Change Request',
      template: 'forgotpassword',
      context: {
        name: user.name,
        link: url
      }
    
    };
    await mailSend(mailOptions)
    res.send(`mail sent to ${user.email}`);
  }
};

exports.recoverPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.findOne({ _id: req.params.id });
    // console.log(user)
    if (!user) {
      req.status(404).send("User Doesnt exists");
    }
    const token = await passwordRecoverModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    // console.log(token)
    if (!token) {
      res.status(400).send("No token available");
    } else {
      await user.updateOne({ password: newHashedPassword });
      await token.remove();
      res.status(200).send("Password Recovered Successfully");
    }
  } catch (error) {
    res.send(error);
  }
};

//details

exports.pilotDetails = async (req, res) => {
 
  const user = req.user._id;
  
  
  const pilot = await pilotModel.findOne({ userId: user });
  await pilotModel
    .findOne({ userId: user })
    .updateOne({ $inc: { views: 1, viewed: 1 } })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("hii");
      }
    });
  if (pilot) {
    res.status(200).send(pilot);
  } else {
    res.status(400).send("Pilot account not there");
  }
};

exports.companyDetails = async (req, res) => {
  const user = req.user._id;
  const pilot = await companyModel.findOne({ userId: user });

  if (pilot) {
    res.status(200).send(pilot);
  } else {
    res.status(400).send("Company account not there");
  }
};

exports.centerDetails = async (req, res) => {
  const user = req.user._id;
  const pilot = await service_centerModel.findOne({ userId: user });

  if (pilot) {
    res.status(200).send(pilot);
  } else {
    res.status(400).send("ServiceCenter account not there");
  }
};

exports.checkUser = async (req, res) => {
  const user = req.user._id;
  await userModel.findOne({ _id: user }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  });
};

exports.updateProfilePic = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });
  const Pilot = await pilotModel.findOne({ userId: user });
  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;

  const resized = await sharp(buffer)
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}89492`,
        Body: data,
      };

      s3.upload(params, async (error, data) => {
        if (error) {
          res.status(500).send(error);
        }

        await User.updateOne({ profilePic: data.key });
        await Pilot.updateOne({ profilePic: data.key }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.updateCoverPic = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });
  const Pilot = await pilotModel.findOne({ userId: user });
  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  // var base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;

  const resized = await sharp(buffer)
    // .resize({
    //     width: 800,
    //     height: 300
    // })
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      console.log(crypto.randomBytes(32).toString("hex"));

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}+12345`,
        Body: data,
      };

      s3.upload(params, async (error, data) => {
        if (error) {
          res.status(500).send(error);
        }
        console.log(data);

        await User.updateOne({ coverPic: data.key }).exec((err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
        await Pilot.updateOne({ coverPic: data.key }).exec((err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.getUserData = async (req, res) => {
  const user = req.user._id;
  try {
    let _user = await userModel.findOne({ _id: user });

    res.send(_user);
  } catch (err) {
    res.send(err);
  }
};

exports.updateNotifications = async (req, res) => {
  const user = req.user._id;
  const {
    droneNews,
    accountPrivacy,
    hiresMe,
    followsMe,
    commentsMe,
    enquiresMe,
    appliesMe,
    messageAlerts,
    jobNotifications,
  } = req.body;
  try {
    let _user = await userModel
      .findOne({ _id: user })
      .updateOne({
        droneNews,
        accountPrivacy,
        hiresMe,
        followsMe,
        commentsMe,
        enquiresMe,
        appliesMe,
        messageAlerts,
        jobNotifications,
      })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          //   res.status(200).send({result
          // });
        }
      });

    res.send("Successfull");
  } catch (err) {
    res.send(err);
  }
};

exports.updateProfilePicServiceCenter = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });
  const Pilot = await service_centerModel.findOne({ userId: user });

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  const resized = await sharp(buffer)
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}ecwhiu`,
        Body: data,
      };

      s3.upload(params, async (error, data) => {
        if (error) {
          res.status(500).send(error);
        }

        await User.updateOne({ profilePic: data.key });
        await Pilot.updateOne({ profilePic: data.key }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.updateCoverPicServiceCenter = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });
  const Pilot = await service_centerModel.findOne({ userId: user });

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  const resized = await sharp(buffer)
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}hgvue`,
        Body: data,
      };

      s3.upload(params, async (error, data) => {
        if (error) {
          res.status(500).send(error);
        }

        await User.updateOne({ coverPic: data.key });
        await Pilot.updateOne({ coverPic: data.key }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.emailResend = async (req, res) => {
  const user = req.user._id;

  const mailToken = await new mailTokenModel({
    userId: user,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();
  const url = `${process.env.BASE_URL}/user/${user}/verify/${mailToken.token}`;

 var mailOptions = {
    from: 'yaseen.nexevo@gmail.com',
    to: req.user.email,
    subject: 'Resend - Nexdro Email Verification',
    template: 'emailResend',
    context: {
      email: req.user.email,
      url: url
    }
  
  };
  await mailSend(mailOptions)
  res.send("successfull");
};

exports.updateProfilePicBooster = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;
  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  const resized = await sharp(buffer)
    .resize({
      width: 125,
      height: 125,
    })
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;
      buffer;

      const params = {
        Bucket: "nexdro",
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}.jpg`,
        Body: data,
      };

      s3.upload(params, async (error, data1) => {
        if (error) {
          res.status(500).send(error);
        }

        await User.updateOne({ profilePic: data1.key }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.updateCoverPicBooster = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  // let buffer = data;

  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  const resized = await sharp(buffer)
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}.jpg`,
        Body: data,
      };

      s3.upload(params, async (error, data) => {
        if (error) {
          res.status(500).send(error);
        }

        await User.updateOne({ coverPic: data.key }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.getBooster = async (req, res) => {
  const User = req.user._id;
  await userModel.findById(User).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.updateBasicInfo = async (req, res) => {
  const user = req.user._id;
  const { name, emailId, phoneNo, dob, gender, city, country, bio } = req.body;
  try {
    let _user = await userModel.findOne({ _id: user });

    if (_user.email !== req.body.emailId) {
      let user2 = await userModel.findOne({ _id: _user._id }).updateOne({
        name,
        email: req.body.emailId,
        phoneNo,
        verify: false,
        dob,
        gender,
        city,
        country,
        bio,
      });
      //send Mail
      const mailToken = await new mailTokenModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}/users/${req.user._id}/verify/${mailToken.token}`;
      let message = `Dear ${req.user.name},

It seems you have changed your email Id,

Please Click the link below to verify your mail Id.

${url}

This Link expires in 1 hour

Thank You
Team Nexdro
`;

      await sendMailVerify(req.body.emailId, "Verify Email", message);
    } else {
      console.log("hii");
      await userModel
        .findOne({ _id: user })
        .updateOne({
          name,
          email: req.body.emailId,
          phoneNo,
          dob,
          city,
          country,
          bio,
        })
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
    }
  } catch (err) {
    res.send(err);
  }
};

exports.updateBoosterRole = async (req, res) => {
  const user = req.user._id;
  await userModel
    .findById(user)
    .updateOne({ role: "booster" })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getUserDataBookmarks = async (req, res) => {
  const user = req.user._id;

  let _user = await userModel
    .findOne({ _id: user })
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        await service_centerModel
          .find({ _id: result.markedCenters })
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

exports.getUsers = async (req, res) => {
  userModel
    .find({})
    .sort({ createdAt: -1 })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.updateProfilePicCompany = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });
  console.log(req.file);

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");
  // let buffer = data;

  const resized = await sharp(buffer)
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto.randomBytes(32).toString("hex")}jcwew`,
        Body: data,
      };

      s3.upload(params, async (error, data1) => {
        if (error) {
          res.status(500).send(error);
        }

        console.log(data1);
        await User.updateOne({ profilePic: data1.key });
        await companyModel
          .findOne({ userId: user })
          .update({ profilePic: data1.key })
          .exec((err, result) => {
            if (err) {
            } else {
              res.send(result);
            }
          });
      });
    });
};

exports.updateCoverPicCompany = async (req, res) => {
  const user = req.user._id;

  const User = await userModel.findOne({ _id: user });

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });

  let data1 = req.body.file.split(",");

  var buffer = Buffer.from(data1[1], "base64");

  const resized = await sharp(buffer)
    .toBuffer()
    .then((data) => {
      console.log(data);
      // let buffer = data;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilePictures/${crypto
          .randomBytes(32)
          .toString("hex")}sehgjisg`,
        Body: data,
      };

      s3.upload(params, async (error, data) => {
        if (error) {
          res.status(500).send(error);
        }

        await User.updateOne({ coverPic: data.key }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
      });
    });
};

exports.checkPilotPro = async (req, res) => {
  if (req.user.pilotPro) {
    res.send(true);
  } else {
    res.send(false);
  }
};

exports.getCenterId = async (req, res) => {
  const { userId } = req.body;
  await service_centerModel.findOne({ userId }).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result._id);
    }
  });
};
function generatePassword() {
  var length = 10,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
exports.createNewUser = async (req, res) => {
  const { name, email, phoneNo, country, role } = req.body;
  const userExists = await userModel.findOne({ email });

  if (userExists) {
    res.status(400);
    res.send("User already exists");
  } else {
    let z = generatePassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(z, salt);
    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      country,
      verify: true,
      role,
    });
    if (user) {
      //mail verify

      const mailToken = await new mailTokenModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}/user/${user._id}/verify/${mailToken.token}`;


      var mailOptions = {
        from: 'yaseen.nexevo@gmail.com',
        to: user.email,
        subject: 'Account Login Credentials',
        template: 'dynamicAccount',
        context: {
         name: user.name,
         email : user.email,
         password: z
        }
      
      };
      await mailSend(mailOptions)
      let message = `Welcome to Drone
    
You have created your account in Nexdro.

Here are your credentials to login.

EmailId: ${user.email}
Password: ${z}
Use this credentials or generate new password using forgot password in login page.

Login Now
${process.env.BASE_URL}/login

Thank You
Team Nexdro
    `;

      await sendMailVerify(user.email, "Welcome to Drone", message);

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verify: user.verify,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
};

exports.testLookup = async (req, res) => {
  userModel
    .find({})
    .sort({ pilotPro: -1 })
    .select("pilotPro")
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getDateUsers = async (req, res) => {
  const start = new Date(req.body.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(req.body.endDate);
  end.setHours(23, 59, 59, 999);
  console.log(start);
  let all = await userModel.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });
  let pilots = await userModel.countDocuments({
    role: "pilot",
    createdAt: { $gte: start, $lte: end },
  });
  let companies = await userModel.countDocuments({
    role: "company",
    createdAt: { $gte: start, $lte: end },
  });

  let centers = await userModel.countDocuments({
    role: "service_center",
    createdAt: { $gte: start, $lte: end },
  });

  let boosters = await userModel.countDocuments({
    role: "booster",
    createdAt: { $gte: start, $lte: end },
  });

  if (req.body.type === "all") {
    await userModel
      .find({ createdAt: { $gte: start, $lte: end } })
      .select("name role email phoneNo country")
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.status(200).json({
            result: result,
            all: all,
            pilots,
            companies,
            centers,
            boosters,
          });
        }
      });
  } else {
    await userModel
      .find({ role: req.body.type, createdAt: { $gte: start, $lte: end } })
      .select("name role email phoneNo country")
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.status(200).json({
            result: result,
            all: all,
            pilots,
            companies,
            centers,
            boosters,
          });
        }
      });
  }
};

exports.checkIp = async (req, res) => {
  let ip = req.connection.remoteAddress;
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // MyModel.find({created_on: {$gte: startOfToday}}, function (err, docs) { ... });
  ipModel
    .find({ ip, createdAt: { $gte: startOfToday } })
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length == 0) {
          const _industry = new ipModel({
            ip,
          });
          try {
            const a1 = await _industry.save();
            res.json(a1);
          } catch (err) {
            res.status(400).send("error");
          }
        } else {
          res.send("Ip used Today");
        }
        let data = req.socket.remoteAddress;
        console.log(data);
      }
    });
};

exports.checkuserNameProfile = async (req, res) => {
  let _user = req.user.id;
  let userName = req.body.userName;
  await pilotModel.find({ userName }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result.length == 0) {
        res.send("available");
      } else {
        if (result[0].userId == _user) {
          res.send("available");
        } else {
          res.send("not available");
        }
      }
    }
  });
};

//jobAlerts

exports.subscribeJobAlerts = async (req, res) => {
  const email = req.body.emailId;
  jobAlertsModel.find({ email }).exec(async (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result.length !== 0) {
        res.send("email registered");
      } else {
        const _jobalert = new jobAlertsModel({
          email,
        });
        try {
          const a1 = await _jobalert.save();
          res.json(a1);
        } catch (err) {
          res.status(400).send("error");
        }
      }
    }
  });
};

exports.editEmail = async (req, res) => {
  let emailId = req.user.email;
  userModel.find({ email: req.body.emailId }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result.length !== 0) {
        if (result[0].email === emailId) {
          res.send("Email Available");
        } else {
          res.send("Email Not Available");
        }
      } else {
        res.send("Email Available");
      }
    }
  });
};

exports.mailToReverify = async (req, res) => {
  const mailToken = await new mailTokenModel({
    userId: req.user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  try {
    const a1 = await mailToken.save();
    if (a1.token) {
      const url = `${process.env.BASE_URL}/user/${req.user._id}/verify/${mailToken.token}`;
      let message = `Greetings from Nexdro,

Seems like you have updated your Email Id, Please verify your new email Id from below link
  
${url}
  
This Link expires in 1 hour
  
Thank You
Team Nexdro
      `;

      await sendMailVerify(req.body.email, "Email Reverify | Nexdro", message);

      res.send("Sent");
    }
  } catch (err) {
    res.send("error");
  }
};

exports.getRoute = async (req, res) => {
  userModel.findOne({ _id: req.params.id }).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result.role === "pilot") {
        pilotModel.findOne({ userId: result._id }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send({ path: `/pilot/${result.userName}` });
          }
        });
      } else if (result.role === "company") {
        companyModel.findOne({ userId: result._id }).exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send({ path: `/company/${result.slug}` });
          }
        });
      } else if (result.role === "service_center") {
        service_centerModel
          .findOne({ userId: result._id })
          .exec((err, result) => {
            if (err) {
              res.send(err);
            } else {
              res.send({ path: `/service-center/${result.slug}` });
            }
          });
      } else {
        res.send("booster");
      }
    }
  });
};

exports.newEmailRequest = async (req, res) => {
  let z = Math.floor(1000 + Math.random() * 9000);
userModel.find({email : req.body.email}).exec(async(err,result)=>{
  if(err){
    res.send(err)
  }else{
    console.log(result)
    if(result.length !== 0){
      res.send("Email not available")
    }else{
      let message = `Greetings from Nexdro,

Seems like you have updated your Email Id, Please verify your new email Id using below OTP
  
${z}
  
This OTP expires in 1 hour
  
Thank You
Team Nexdro
      `;

      await sendMailVerify(req.body.email, "Email Reverify | Nexdro", message);
res.json(z)
    }
  }
})
      
};

exports.changeEmailId = async (req,res)=>{
  const userId = req.user._id;
  userModel.findOne({_id: userId}).updateOne({email: req.body.email}).exec((err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send("Changed")
      if(req.user.role == "pilot"){
        pilotModel.findOne({userId: userId}).updateOne({emailId: req.body.email}).exec((err,result)=>{})
      }
    }
  })
}

exports.test = async (req,res) =>{
  var mailOptions = {
    from: 'yaseen.nexevo@gmail.com',
    to: "nidheesh.nexevo@gmail.com",
    subject: 'Sending Email using Node.js',
    template: 'email',
    context: {
      title: 'Title Here',
      text: "Lorem ipsum dolor sit amet, consectetur..."
    }
  
  };
  await mailSend(mailOptions)
}