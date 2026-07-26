import transporter from "../config/mail.js";
import Lead from "../models/leads.model.js";

export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const lead = await Lead.create({
        email
    })

    await transporter.sendMail({
      from: `"Portfolio Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: "📩 New Portfolio Contact",
      html: `
        <h2>New Portfolio Inquiry</h2>

    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>

    <hr>

    <p>This lead came from your portfolio website.</p>
      `,
    });

    return res.status(200).json({
      message: "Thank you! We'll be in touch soon.",
      lead
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
