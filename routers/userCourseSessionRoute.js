let __express = require("express");
let __router = __express.Router();

const __userCourseSessionController = require("../controllers/userCourseSessionController");

__router.post("/create", __userCourseSessionController.createUserCourseSession);
__router.put("/update", __userCourseSessionController.updateUserCourseSessionEndTime);
__router.get("/:userCourseId/:sessionCounter", __userCourseSessionController.getUserCourseSessionDetails);

module.exports = __router;