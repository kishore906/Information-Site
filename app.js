const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" }); //File which contains Database details

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

app.set("view engine", "hbs");

//Folder for different navigation pages
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

//PARSE URL-ENCODED BODIES (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

//Parse JSON bodies (As sent by API clients)
app.use(express.json());
app.use(cookieParser());

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

//Defining Routes (i.e Pages for navigation)
app.use("/", require("./routes/pages"));
app.use("/", require("./routes/auth"));

app.listen(3700, () => {
  console.log("Server started Listening to port 3700");
});
