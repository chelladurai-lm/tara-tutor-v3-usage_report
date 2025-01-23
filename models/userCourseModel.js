const __mongoose = require("mongoose");
const _schema = __mongoose.Schema;

const _userCourseModel = new _schema({
     customerAccountId: { type: __mongoose.Types.ObjectId, required: true },
     userId: { type: __mongoose.Types.ObjectId, required: true },
     grade: { type: String, required: true },
     course: { type: String, required: true },
     role: { type : String },
     curUnit: { type: Number, required: true },
     curLesson: { type: Number, required: true },     
     courseStarted : { type: Date },
     courseCompleted: { type: Date },
     courseStatus: { type: String, enum: ["IP", "CO"] }
});

const _userCourse = __mongoose.model("user_course", _userCourseModel, "user_course");

_userCourseModel.index({ customerAccountId: 1, userId: 1, grade: 1, course: 1 });

module.exports = _userCourse;