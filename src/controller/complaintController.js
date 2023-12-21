const complaintsModel = require("../models/complaintsModel");
const sendMailVerify = require("../../utils/sendMail.js");
exports.createComplain = async (req,res)=>{
    const { name, email , phone, country, subject, query } =
    req.body;
  const _complain = new complaintsModel({
    name, email , phone, country, subject, query 
  });
  try {
    const a1 = await _complain.save();
    res.json(a1);
    let message = `Thank you for contacting Nexdro
        
Your issue has been successfully submitted. Our Team will contact you in next 48 hours.
    
Thank You
Team Nexdro
        `;

        await sendMailVerify(
          req.body.email,
          "Complaint Raised | Nexdro",
          message
        );
  } catch (err) {
    res.send("error");
  }
}