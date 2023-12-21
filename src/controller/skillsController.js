const skillModal = require("../models/skillsModel");


exports.createSkill = async (req, res) => {
    const { skill } =
      req.body;
    const _industry = new skillModal({
    skill
    });
    try {
      const a1 = await _industry.save();
      res.json(a1);
    } catch (err) {
      res.send("error");
    }
  };
  

  exports.getSkills = async (req, res) => {
    skillModal.find({ })
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  };
  
  exports.deleteSkill = async (req, res) => {
    let id = req.params.id;
  skillModal.deleteOne({_id :id })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};