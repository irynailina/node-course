const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const nodemailer = require("nodemailer");

// шаг 1

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: "irynaillina@gmail.com",
//   from: "irynailina@gmail.com",
//   subject: "Sending with Twilio SendGrid is Fun",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };
// sgMail.send(msg);

// async function main() {
//   console.log(await sgMail.send(msg));
// }

// main();

class EmailingClient {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }

  async sendVerificationEmail(email, verificationLink) {
    return this.transporter.sendMail({
      to: email,
      from: process.env.NODEMAILER_EMAIL,
      subject: "Please, verify your email",
      html: `<a href="${verificationLink}">Verification link</a>`,
    });
  }
}

exports.emailingClient = new EmailingClient();
