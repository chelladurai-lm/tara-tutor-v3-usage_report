const __express = require("express");
const __router = __express.Router();

const __userCourseController = require("../controllers/userCourseController");

__router.post("/create", __userCourseController.createUserCourse);
__router.put("/update", __userCourseController.updateUserCourse);
__router.get("/:customerAccountId/:userId/:course/:grade", __userCourseController.getUserCourseDetails);
__router.get("/report/:customerAccountId", __userCourseController.getUserCourseReport);

module.exports = __router;