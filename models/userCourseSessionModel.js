const mongoose = require("mongoose");
const _schema = mongoose.Schema;

const _userCourseSessionModel = new _schema({
     userCourseId: { type: mongoose.Schema.Types.ObjectId, ref: "user_course", required: true },
     unit: { type: Number, required: true },
     lesson: { type: Number, required: true },     
     sessStart: {type: Date, required: true},
     sessEnd: {type: Date, required: true},
     sessCount: {type: Number}
});

const _userCourseSession = mongoose.model("user_course_session", _userCourseSessionModel, "user_course_session");

_userCourseSessionModel.index({ userCourseId: 1 });

module.exports = _userCourseSession;