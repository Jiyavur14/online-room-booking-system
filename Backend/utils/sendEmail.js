/*const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StayNest" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;*/

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {

  try {

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,

      },

    });

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to,

      subject,

      html,

    });

    console.log("Email sent successfully to:", to);

  } catch (error) {

    console.error("Email error:", error);

    throw error;

  }

};

module.exports = sendEmail;