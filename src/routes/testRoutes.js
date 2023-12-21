const express = require("express");
const upload1 = require("../middlewares/s3upload");
const imageModel = require("../models/imageModel");
const router = express.Router();


const singleUpload = upload1.single("testFile");

router.post("addFile", function (req, res) {

  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    // let update = { profilePicture: req.file.location };

    res.send(req.file.location)
  });
});


router.get(`test` , async (req, res) => {

    imageModel.find({ status: "rejected" })
      .sort({ updatedAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  })

module.exports = router;
