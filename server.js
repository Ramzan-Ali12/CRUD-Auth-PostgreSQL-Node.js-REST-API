const express = require('express')
const dotenv = require('dotenv')
const { Sequelize } = require('sequelize')
const morgan = require('morgan')
const User = require('./models/crud-model')
const bodyParser = require('body-parser')
const sequelize=require('./database/connection')
const cors=require('cors')
dotenv.config({ path: './config/.env' })
const PORT = process.env.PORT || 8080
const app = express()
app.use(bodyParser.json())

// this will print the log request
app.use(morgan('tiny'))

// middleware
app.use(express.json())
app.use(cors())
// load routes
app.use('/',require('./routes/router'));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
// call the database
sequelize
  .sync()
  .then(result => {
    console.log("Database connected Successfuly!");
  
  })
  .catch(err => console.log(err));