const express = require("express");
const Auth = require("../models/auth-model");
const jwt = require("jsonwebtoken");
// function to check the user already exists in the database
// this is to avoid the same user with duplicate user
exports.saveuser = async (req, res, next) => {
  // search the user in the database and check if the user already exists
  try {
    const userName = await Auth.findOne({
      // use where clause to find the userName
      where: {
        userName: req.body.userName,
      },
    });
    // if the userName already exists in database send error 409
    if (userName) {
      return res.status(409).send("Username already Exists!");
    }

    // check for email
    const emailcheck = await Auth.findOne({
      // use the where clause to find the Email from the datebase
      where: {
        email: req.body.email,
      },
    });
    // if the userName already exists in database send error 409
    if (emailcheck) {
      res.status(409).send("Authentication failed Email already exists!");
    }
    next();
  } catch (error) {
    console.log(error);
    req.status(500).send({
      status: "error",
      message: "Failed to register/authenticate user. Please try again later.",
    });
  }
};

// Validate Login middleware
exports.validateLoginInput = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({
      status: "Failed",
      message: "Email and Password are Required!",
    });
  }
  next();
};

// Validate changePassword
exports.checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // get token from headers
      const token = authorization.split(" ")[1];
      if (!token) {
        res.status(400).send({
          status: "Failed",
          message: "Unauthorize user No Token!",
        });
      }
      // verify Token using jwt
      const {userId} = jwt.verify(token, process.env.SECRETKEY);
      console.log(userId)
      // Get User from Token
      req.user = await Auth.findOne({
        where: {
          id: userId,
        },
      })
      next()
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unauthorize token",
      });
    }
  } else{
    res.status(400).send({
      status: "Failed",
      message: "Authorization not found!",
    });
  }

  
};
