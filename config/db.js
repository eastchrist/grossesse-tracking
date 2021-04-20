let mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: "./.env"});

let connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE,
  port: 3307
});

connection.connect((error) => {
  console.log("MYSQL Connection...")
  if (error) {
    console.log(error)
  } else {
    console.log("MYSQL Connected...")
  }
})

module.exports = connection
