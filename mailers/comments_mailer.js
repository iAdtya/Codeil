const nodemailer = require("nodemailer");

exports.newComment = (comment) => {
  console.log("inside newComment mailer",comment);

  nodemailer.transporter.sendMail(
    {
      from: "workethics69@gmail.com",
      to: comment.user.email,
      subject: "New Comment Published",
      html: "<h1>Yup, your comment is now published!</h1>",
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message sent", info);
      return;
    }
  );
};
