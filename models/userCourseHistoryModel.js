const __mongoose = require("mongoose");
const _schema = __mongoose.Schema;

const _userCourseHistoryModel = new _schema({
     userCourseId: {type: __mongoose.Schema.Types.ObjectId, ref: "user_course"},
     unit: { type: Number, required: true },
     lesson: { type: Number, required: true },
     start_date: {type: Date},
     end_date: {type: Date},
     status: {type: String},
     history: [{type: Object}]
});

const _userCourseHistory = __mongoose.model("user_course_history", _userCourseHistoryModel,"user_course_history");

_userCourseHistoryModel.index({ userCourseId: 1  });

module.exports = _userCourseHistory;