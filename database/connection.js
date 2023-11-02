const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: false //It display the all the Query details
  }
)
module.exports = sequelize
