const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const User = require("../authentication/model/user");

const forgotPassword = async (req, res) => {
    const { emailId } = req.body;
    try {
        console.log('Looking for user...');
        const user = await User.findOne({ email: emailId });
        if (!user) {
            return res.status(401).send("No user found with this email ID");
        }

        console.log('User found:', user);

        // Create a token manually (without secret key)
        const resetToken = Buffer.from(JSON.stringify({ _id: user._id, exp: Date.now() + 15 * 60 * 1000 })).toString('base64');

        // Construct reset URL
        const resetUrl = `http://localhost:5000/resetPassword/${resetToken}`;

        console.log("Creating transporter...");
        console.log("Gmail:", process.env.gmail);
        console.log("Password:", process.env.password ? "********" : "Not Set");

        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmail,
                pass: process.env.password
            }
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error("Failed to connect to email service:", error);
            } else {
                console.log("Email service is ready to send messages.");
            }
        });

        const mailOptions = {
            from: process.env.gmail,
            to: user.emailId,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password:
            ${resetUrl}`
        };

        console.log('Preparing to send email...');
        await transporter.sendMail(mailOptions);

        console.log('Reset password email sent successfully');
        res.status(200).send("Reset password email sent successfully");
    }
    catch (err) {
        console.error('Error while sending email:', err);
        res.status(500).send("Error while sending email: " + err.message);
    }
}
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Decode the token
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));

        if (!decoded || Date.now() > decoded.exp) {
            return res.status(401).send("Invalid or expired token");
        }

        const user = await User.findById(decoded._id); // Use decoded._id instead of _id
        if (!user) {
            return res.status(401).send("No user found with this email ID");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).send("Password updated successfully!");
    }
    catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).send("Error!" + err.message);
    }
}
module.exports = { forgotPassword, resetPassword };