const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "workethics69@gmail.com",
    pass: "LENOVO@50000",
  },
});

const renderTemplate = async (data, relativePath) => {
  try {
    // Use await with renderFileAsync
    const template = await renderFileAsync(
      path.join(__dirname, "../views/mailers", relativePath),
      data
    );

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
