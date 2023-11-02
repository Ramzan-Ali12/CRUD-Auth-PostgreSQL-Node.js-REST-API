const { Sequelize } = require('sequelize')
const db=require('../database/connection')

const User=db.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

// console.log(User)
module.exports = User;
