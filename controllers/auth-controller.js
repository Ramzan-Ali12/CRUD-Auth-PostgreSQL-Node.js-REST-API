const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Auth = require('../models/auth-model')
const { emit } = require('nodemon')
const { where, DATE} = require('sequelize')
const { use } = require('../routes/router')
const { sendEmail } = require('../utils/email')
const { errorMonitor } = require('nodemailer/lib/xoauth2')
const otpGenerator = require('otp-generator')

// Register user
exports.signup = async (req, res) => {
  try {
    const { userName, email, password, password_confirmation } = req.body

    // Check if all required fields are provided
    if (!userName || !email || !password || !password_confirmation) {
      return res.status(400).send({
        status: 'failed',
        message: 'All fields are required!'
      })
    }

    // Check if passwords match
    if (password !== password_confirmation) {
      return res.status(400).send({
        status: 'failed',
        message: 'Password do not match!'
      })
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    // Create a new user instance
    const newUser = new Auth({
      userName: userName,
      email: email,
      password: hashPassword
    })

    // Save the new user
    await newUser.save()
    // console.log(newuser)
    // Find the saved user
    const savedUser = await Auth.findOne({ where: { email: email } })

    // Create a JWT token
    const token = jwt.sign({ userId: savedUser.id }, process.env.secretKey, {
      expiresIn: '1d'
    })

    // Send success response with token
    res.status(201).send({
      status: 'Success',
      message: 'User Registration Successfully!',
      id: savedUser.id,
      name: savedUser.userName,
      email: savedUser.email,
      accessToken: token
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({
      status: 'failed',
      message: 'Unable to register user!'
    })
  }
}

// Login User

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Auth.findOne({ where: { email: email } })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate Token
      const token = jwt.sign({ userId: user.id }, process.env.SECRETKEY, {
        expiresIn: '1d'
      })

      return res.status(200).send({
        status: 'Success',
        message: 'Login successfully!',
        id: user.id,
        name: user.userName,
        email: user.email,
        accessToken: token
      })
    }

    return res.status(401).send({
      status: 'Error',
      message: 'Invalid email or password'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      status: 'Error',
      message: 'Internal server error'
    })
  }
}
// changeUser Password
exports.changeUserpassword = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body
    if (password && password_confirmation) {
      // Check if the new password matches the confirmation
      if (password !== password_confirmation) {
        return res.status(400).send({
          status: 'Failed',
          message: "New password and confirm new password don't match!"
        })
      }

      // create salt for password
      const saltRounds = 10
      const salt = bcrypt.genSaltSync(saltRounds)

      // hash the plaintext password with the generated salt
      const newhashPassword = await bcrypt.hash(password, salt)

      // update the password in the database

      await Auth.update(
        { password: newhashPassword },
        {
          where: {
            id: req.user.id
          }
        }
      )
      res.status(200).send({
        status: 'Success',
        message: 'Password Updated Successfully!'
      })
    } else {
      res.status(400).send({
        status: 'Failed',
        message: 'All fields are required!'
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'failed', message: 'Internal Server Error' })
  }
}
// forget password
exports.sendUserPasswordResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    if (email) {
      const user = await Auth.findOne({ where: { email: email } })
      // console.log(user)
      // check if the user Exists
      if (user) {
        // If the User Exists Generate OTP
        // const otp = Math.floor(1000 + Math.random() * 9000)
        // console.log(otp)
        const otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false
        })
        // console.log(otp)
        const otpAddedAt = new Date()
        // expire otp after 1 minutes
        // const otpexpire = otpAddedAt.setMinutes(otpAddedAt.getMinutes() + 2)

        // generate link to send password reset email
        const link = `http://localhost:3000/api/auth/send-reset-password-email/${user.id}/OTP=${otp}`
        const html = `<a href=${link}>Click Here</a> to Reset Your Password`
        const subject = 'Reset Password OTP'
        const text = `Your OTP (It is expired after 1 min) : <strong>OTP ${otp}</strong> <br> or click here ${html}`
        const emailSent = await sendEmail(user.email, subject, text, html)
        // save the otp in database
        user.otp = otp
        user.otpaddedat = otpAddedAt
        user.save()

        // save the current time in database when the otp is send to user
        res.status(200).send({
          status: 'Sucess',
          message: 'Password Reset Email Sent... Please Check Your Email!',
          emailSent
        })
      } else {
        res
          .status(500)
          .send({ status: 'failed', message: "User doesn't Exists!" })
      }
    } else {
      res
        .status(500)
        .send({ status: 'failed', message: 'Email field is Required' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'failed', message: 'Internal Server Error' })
  }
}

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { otp, email, password, password_confirmation } = req.body

    const user = await Auth.findOne({
      where: {
        email: email
      }
    })
    // console.log('User:', user)

    if (!user) {
      return res.status(400).send({
        status: 'failed',
        message: 'User does not exist!'
      })
    }

    if (!otp || !email || !password || !password_confirmation) {
      return res.status(400).send({
        status: 'failed',
        message: 'All fields are required!'
      })
    }
 

    // check the OTP validation
    if (otp !== user.otp) {
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid OTP!'
      })
    }
    // Check  OTP Expiration 
    const currentTime = new Date()
    let otpAddedAt = new Date(user.otpaddedat)

    // console.log(currentTime, otpAddedAt)

    const expirationInMinutes = 1
    let dif = currentTime - otpAddedAt
    dif = Math.round(dif / 1000 / 60)

    // console.log(`difference in Minutes ${dif}`)

    if (dif > expirationInMinutes) {
      return res.status(400).send({
        status: 'failed',
        message: 'OTP Expired!'
      })
    }
  
    // // check if the password and password_confirmation is
    if (password && password_confirmation) {
      // Check if the new password matches the confirmation password
      if (password !== password_confirmation) {
        return res.status(400).send({
          status: 'Failed',
          message: "New password and confirm new password don't match!"
        })
      }

      // Create salt for password
      const saltRounds = 10
      const salt = bcrypt.genSaltSync(saltRounds)

      // Hash the plaintext password with the generated salt
      const newhashPassword = await bcrypt.hash(password, salt)

      // Update the password in the database
      await Auth.update(
        { password: newhashPassword },
        {
          where: {
            email: user.email
          }
        }
      )
      return res.status(200).send({
        status: 'Success',
        message: 'Password Updated Successfully!'
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({
      status: 'failed',
      message: 'Internal Server Error'
    })
  }
}
