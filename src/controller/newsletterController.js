const newsletterModel = require("../models/newsletterModel");

  exports.createNews = async(req, res)=>{
    console.log(req.body)
    const { emailId } = req.body;
    await newsletterModel.find({email: emailId}).exec(async (err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length !== 0){
                res.send("Email Exists")
            }else{
                const _industry = new newsletterModel({
                    email: emailId
                });
                try {
                  const a1 = await _industry.save();
                  res.json("successfull");
                } catch (err) {
                  res.send("error");
                }
            }
        }
    })
   
  }
