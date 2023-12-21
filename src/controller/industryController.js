const industryModal = require("../models/industryModal");

exports.createIndustry = async (req, res) => {
    const { industry } =
      req.body;
    const _industry = new industryModal({
    industry
    });
    try {
      const a1 = await _industry.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
  };
  
  exports.getIndustries = async (req, res) => {
    industryModal.find({ })
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  };
  
  exports.deleteIndustry = async (req, res) => {
      let id = req.params.id;
    industryModal.deleteOne({_id :id })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  };
  