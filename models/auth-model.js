const { Sequelize, STRING } = require("sequelize");
const db = require("../database/connection");

const Auth = db.define(
  "auth",
  {
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      isEmail: true, //check for the Email formate
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    otp: {
      type: Sequelize.STRING,
      require: true,
    },
    otpaddedat: {
      type: Sequelize.DATE,
    },
  },
  { timestamps: true }
);

module.exports = Auth;
