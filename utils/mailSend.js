const path = require('path')
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

module.exports = async (mailOptions) => {
    try {
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'alosh.nexevo@gmail.com',
              pass: 'pscnpqdrrpcvxjbi'
          }
          });
         
        const handlebarOptions = {
          viewEngine: {
            extName: ".hbs",
            partialsDir: path.resolve('./views'),
            defaultLayout: false,
          },
          viewPath: path.resolve('./views'),
          extName: ".hbs",
        }
        
        transporter.use('compile', hbs(handlebarOptions));
        
// var mailOptions = {
//     from: 'yaseen.nexevo@gmail.com',
//     to: "nidheesh.nexevo@gmail.com",
//     subject: 'Sending Email using Node.js',
//     template: 'email',
//     context: {
//       title: 'Title Here',
//       text: "Lorem ipsum dolor sit amet, consectetur..."
//     }
  
//   };
  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


    } catch (error) {
        console.log("Email not sent")
        console.log(error)
    }
}


