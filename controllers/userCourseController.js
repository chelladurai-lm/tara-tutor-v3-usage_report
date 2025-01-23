let __mongoose = require("mongoose");
let __userCourseModel = require("../models/userCourseModel");
let { _sendResponse, _getStatusResponse } = require("../utils/common");

exports.createUserCourse = async(req, res) => {
    console.log('create usser course >>> 1', req.body);

    try {
        const _customerAccountId = req.body.customerAccountId;
        const _userId = req.body.userId;
        const _grade = req.body.grade;
        const _course = req.body.course;
        const _curUnit = req.body.currentUnit;
        const _curLession = req.body.currentLesson;
        const _courseStarted = req.body.courseStarted;
        const _courseCompleted = req.body.courseCompleted;
        const _courseStatus = _getStatusResponse(req.body.courseStatus);
        const _userRole = req.body.userRole;

        console.log(_courseStatus);

        if(
            !_customerAccountId || 
            !_userId || 
            !_grade || 
            !_course ||
            !_curUnit || 
            !_curLession || 
            !_courseStarted ||
            !_courseStatus || 
            !_userRole
        ){
            return _sendResponse(
                res,
                400,
                "Missing required fields. Please provide: customerAccountId, userId, grade, course, currentUnit, currentLesson, courseStarted, courseStatus and userRole."
            )
        }

        let __userCourseExist = await __userCourseModel.find({
            customerAccountId: _customerAccountId,
            userId: _userId,
            grade: _grade,
            course: _course
        });

        if (__userCourseExist.length) {
            return _sendResponse(res,409,"user course already exist.");
        }else {
            const _userCourse = new __userCourseModel({
                customerAccountId: _customerAccountId,
                userId: _userId,
                grade: _grade,
                course: _course,
                role: _userRole,
                curUnit: _curUnit,
                curLesson: _curLession,
                courseStarted: _courseStarted,
                courseCompleted: _courseCompleted,
                courseStatus : _courseStatus
            });
            const _finalRes = await _userCourse.save();
            return _sendResponse(res,201,"New user course document created.",_finalRes);
        }

    } catch (error) {
        return _sendResponse(res,500,"An error occurred while creating the data. Please try again later.",{error: error.message});
    }

};


exports.updateUserCourse = async(req, res) => {
    console.log('update user course >>> 1', req.body);

    try{

    const _customerAccountId = req.body.customerAccountId;
    const _userId = req.body.userId;
    const _grade = req.body.grade;
    const _course = req.body.course;
    const _curUnit = req.body.currentUnit;
    const _curLession = req.body.currentLesson;
    const _courseStatus = _getStatusResponse(req.body.courseStatus);
    const _courseCompleted = req.body.courseCompleted;

    if(!_customerAccountId || !_userId || !_grade || !_course){
        return _sendResponse(res,400,"Please follow this format to updated the user course: /:customerAccountId/:userId/:course/:grade");
    }

    let __filter = { customerAccountId: _customerAccountId, userId: _userId, grade: _grade, course: _course  };

    const _updateReqField = {};

    if(_curUnit){ _updateReqField.curUnit = _curUnit }
    if(_curLession){  _updateReqField.curLesson = _curLession }
    if(_courseCompleted){ _updateReqField.courseCompleted = _courseCompleted }
    if(_courseStatus){  _updateReqField.courseStatus = _courseStatus }

    const _isUserCourseExist = await __userCourseModel.find(__filter);

    if(_isUserCourseExist.length > 0) {

        if(!_curUnit && !_curLession && !_courseCompleted && !_courseStatus){
            return _sendResponse(res,400,"Please provide at least one field to update: currentUnit, currentLesson, courseStatus and courseCompleted");
        }

        await __userCourseModel.findOneAndUpdate(
            __filter,
            { $set: _updateReqField },
            { new: true}
        );
        return _sendResponse(res,200,"Successfully updated the user course data.");
    }else {
        return _sendResponse(res,400,"Failed to update the user course data. The user course data is not exist.");
    }
    } catch(error){
        return _sendResponse(res,500,`An error occurred while updating the user course details. ${error.message}.`);
    }
};

exports.getUserCourseDetails = async(req, res) => {
    console.log('get user course details >>> 1', req.params);

    try{
        
        const _customerAccountId = req.params.customerAccountId;
        const _userId = req.params.userId;
        const _grade = req.params.grade;
        const _course = req.params.course;
        const _ischeck = req.query.ischeck;

        if(!_customerAccountId || !_userId || !_grade || !_course){
            return _sendResponse(res,400,"Missing required fields. Please provide in this format: /user-course/customerAccountId/userId/course/grade");
        }

        const _reqObj = { customerAccountId: _customerAccountId, userId: _userId, grade: _grade, course: _course };        
        const _userCourseExist = await __userCourseModel.find(_reqObj);
        
        if (_userCourseExist.length > 0) {
            return _sendResponse(res,200,"user course data exist",_userCourseExist);
        } else {
            return _sendResponse(res,404,"user course data does not exist");
        }

    } catch (error) {
        return _sendResponse(res,500,`An error occurred while get the user course details. ${error.message}.`);
    };
    
};

exports.getUserCourseReport = async(req, res) => {
    console.log('get user course report >>> 1', req.params);

    try{
        
        const _customerAccountId = req.params.customerAccountId;

        if(!_customerAccountId){
            return _sendResponse(res,400,"Missing required fields. Please provide in this format: /user-course/report/customerAccountId");
        }

        
        let userExist = await __userCourseModel.aggregate([
            {
              $match: reqObj
            },
            {
              $lookup: {
                from: "user_course_history",
                localField: "_id",
                foreignField: "userCourseId",
                as: "lessonHistory"
              }
            },
            {
              $lookup: {
                from: "customer_users", 
                localField: "customerAccountId",
                foreignField: "_id",
                as: "userDetails"
              }
            },
            {
              $lookup: {
                from: "user_course_session",
                localField: "_id",
                foreignField: "userCourseId",
                as: "sessionDetails"
              }
            },
            {
              $group: { _id: "$customerAccountId", gradeCourses: { $push: "$$ROOT" } }
            },
          ]).exec()
          if (userExist.length) {
            
            let tempUserExist = userExist
            userExist.map((user, userindex) => {
              user.gradeCourses.map((course, courseindex) => {
                let timeSpentOnCourse = 0
                course.lessonHistory.map((lesson, lessonindex) => {
                  let timeSpentOnLesson = 0
                  lesson.history.map((history, historyindex) => {
                    tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['activityTimeSpent'] = {}
                    let timeSpentOnAllActivities = 0
                    if (history.activityData) {
                      Object.keys(history.activityData).forEach(key => {
                        let attempt_duration = 0;
                        history.activityData[key].map((attempt, attemptindex) => {
                          let start = moment(attempt.activity_start_time); // some random moment in time (in ms)
                          let end = moment(attempt.activity_end_time); // some random moment after start (in ms)
                          let diff = end.diff(start, 'milliseconds');
                          tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['activityData'][key][attemptindex]['duration'] = diff
                          tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['activityData'][key][attemptindex]['durationhhmmss'] = moment.utc(diff).format('HH:mm:ss')
                          attempt_duration = attempt_duration + diff
                        })
                        tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['activityTimeSpent'][key] = attempt_duration
                        tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['activityTimeSpent'][`${key}hhmmss`] = moment.utc(attempt_duration).format('HH:mm:ss')
                        timeSpentOnAllActivities = timeSpentOnAllActivities + attempt_duration
                      })
                    }
                    tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['timeSpentOnLessonAttempt'] = timeSpentOnAllActivities
                    tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['history'][historyindex]['timeSpentOnLessonAttempthhmmss'] = moment.utc(timeSpentOnAllActivities).format('HH:mm:ss');
                    timeSpentOnLesson = timeSpentOnLesson + timeSpentOnAllActivities
                  })
                  tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['timeSpentOnLesson'] = timeSpentOnLesson
                  tempUserExist[userindex]['gradeCourses'][courseindex]['lessonHistory'][lessonindex]['timeSpentOnLessonhhmmss'] = moment.utc(timeSpentOnLesson).format('HH:mm:ss')
                  timeSpentOnCourse = timeSpentOnCourse + timeSpentOnLesson
                })
                tempUserExist[userindex]['gradeCourses'][courseindex]['timeSpentOnCourse'] = timeSpentOnCourse
                tempUserExist[userindex]['gradeCourses'][courseindex]['timeSpentOnCoursehhmmss'] = moment.utc(timeSpentOnCourse).format('HH:mm:ss');
              })
            })
      
            return res.status(200).json({
              data: tempUserExist,
              statusCode: 200
            })
          } else {
            return res.status(404).json({
              data: null,
              statusCode: 404
            })
          }


    } catch (error) {
        return _sendResponse(res,500,`An error occurred while get the user course details. ${error.message}.`);
    };
    
};