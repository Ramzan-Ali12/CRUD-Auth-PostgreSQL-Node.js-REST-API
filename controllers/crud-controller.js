const { where } = require('sequelize')
const User = require('../models/crud-model')

// find ALL Users
exports.findUser = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.status(200).json({message:"User found Successfuly!", users: users })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ message: 'Error Finding the user information' });

    })
}
// find user by ID
exports.findUserByID = (req, res, next) => {
  const userId = req.params.userId
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: 'User Not found!' })
      }
      res.status(200).json({ user: user })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ message: 'Error finding user by ID' })
    })
}
// Create User
exports.createUser = async (req, res, next) => {
  const { name, email, gender, status } = req.body

  try {
    // create user
    const result = await User.create({
      name: name,
      email: email,
      gender: gender,
      status: status
    })

    console.log('User Created Successfully!')
    res
      .status(201)
      .json({ message: 'User Created Successfully!', user: result })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Unable to Create User' })
  }
}
// Update user by ID
exports.updateUser = async (req, res, next) => {
  const userId = parseInt(req.params.userId)
  const { name, email, gender, status } = req.body

  await User.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(400).json({
          message: `Cannot Update user with ${userId}. Maybe user not found!`
        })
      }
      user.name = name
      user.email = email
      user.gender = gender
      user.status = status
      return user.save()
    })
    .then(result => {
      res
        .status(200)
        .json({ message: 'User Updated Successfuly!', user: result })
    })
    .catch(err => {
      // console.log(err)
      res.status(500).send({ message: 'Error Updating the user information' })
    })
}
// Delete User
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId
  await User.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(400).json({
          message: `Cannot delete user with ${userId}. Maybe user not found!`
        })
      }
      return user.destroy({
        where: {
          id: userId
        }
      })
    })
    .then(result => {
      res
        .status(200)
        .json({ message: 'User was deleted Successfuly!' })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ message: 'Error deleting the user information' })
    })
}
