const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.user,
    pass:process.env.pass,
  },
});

const renderTemplate = async (data, relativePath) => {
  try {
    // Use await with renderFileAsync
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
          console.log('template',template); //?your template string
         if (err){console.log('error in rendering template'); return}
         
         mailHTML = template;
        }
    )
    return template; // Return the template HTML
  } catch (err) {
    console.log("error in rendering template:", err);
    throw err; // Rethrow the error for handling in the calling code
  }
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
