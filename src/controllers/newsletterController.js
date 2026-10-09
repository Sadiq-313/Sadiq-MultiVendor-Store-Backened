import sendMail from "../utils/sendMail.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address!",
      });
    }

    // Customer ko confirmation email bhejna
    await sendMail({
      email: email,
      subject: "Welcome to Our Store Newsletter!",
      message: "Thank you for subscribing to our newsletter! You will now receive updates on our latest news, events, and offers.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Thank you for subscribing! 🎉</h2>
          <p>Hi there,</p>
          <p>You have successfully subscribed to our newsletter with <strong>${email}</strong>.</p>
          <p>Stay tuned for exclusive discount offers, sales events, and new arrivals!</p>
          <br/>
          <p>Best regards,<br/><strong>Sadiq Multi-Vendor Store Team</strong></p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Subscription successful! Check your email for confirmation.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};