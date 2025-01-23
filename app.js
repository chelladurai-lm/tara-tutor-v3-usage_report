require("dotenv").config();
const express = require("express");
const cors = require("cors");
const __connectToDB = require("./config/databaseconfig");

let __userCourseRouter = require("./routers/userCourseRoute");
let __userCourseSessionRouter = require("./routers/userCourseSessionRoute");
let __userCourseHistoryRouter = require("./routers/userCourseHistoryRoute"); 

const __app = express();
const __PORT = process.env.PORT || 6000;
const __BASE_URL = process.env.BASE_URL || 'http://localhost';

__connectToDB()
  .then(() => {
    console.log(`Database connection successful`);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

__app.use(cors());
__app.use(express.json());
__app.set("view engine", "ejs");
__app.use(express.urlencoded({ extended: true })); // using this code to get the req.body data in post request


// api endpoints
__app.use("/user-course",__userCourseRouter);
__app.use("/user-course-session",__userCourseSessionRouter);
__app.use("/user-course-history",__userCourseHistoryRouter);

__app.listen(__PORT, () => {
    console.log(`Server running on ${__BASE_URL}:${__PORT}`);
})

