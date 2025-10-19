const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.APP_PASSWORD,
	},
});

/**
 * Send a verification email with a 6-digit code
 * @param {string} to - recipient email
 * @param {string} code - 6-digit code
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, code) => {
	return transporter.sendMail({
		from: process.env.GMAIL_USER,
		to,
		subject: "Your QuickRent Verification Code",
		html: `<p>Your verification code is: <b>${code}</b></p><p>This code will expire in 10 minutes.</p>`
	});
};

module.exports = {
	transporter,
	sendVerificationEmail,
};
