const nodemailer = require('nodemailer')
const Auth=require("../models/auth-model")

module.exports.sendEmail = async (email, subject, html,text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      text: text,
      html: html,
     
    })

    console.log('email sent sucessfully')
    return true
  } catch (error) {
    console.log(error, 'email not sent')
    return false
  }
}


