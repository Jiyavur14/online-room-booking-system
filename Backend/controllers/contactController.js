const nodemailer = require("nodemailer");

exports.sendContactMail = async (req, res) => {

  try {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {

      return res.status(400).json({ message: "All fields are required" });

    }

    // Use SAME transporter config you used in payment

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,

      },

    });

    await transporter.sendMail({

      from: `"StayNest Contact" <${process.env.EMAIL_USER}>`,

      to: process.env.EMAIL_USER, // You receive the mail

      subject: `Contact Form: ${subject}`,

      html: `

        <h3>New Contact Message</h3>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>

      `,

    });

    res.status(200).json({ message: "Message sent successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

