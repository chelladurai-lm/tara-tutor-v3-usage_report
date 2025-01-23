const __express = require("express");
const __router = __express.Router();

const __userCourseHistoryController = require("../controllers/userCourseHistoryController");

__router.post("/create", __userCourseHistoryController.createUserCourseHistory);
__router.put("/update", __userCourseHistoryController.updateUserCourseHistory);
__router.get("/", __userCourseHistoryController.getUserCourseHistory);

module.exports = __router;