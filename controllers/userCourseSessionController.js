let mongoose = require("mongoose");
let __userCourseSessionModel = require("../models/userCourseSessionModel");
let { _sendResponse } = require("../utils/common");

exports.createUserCourseSession = async(req, res) => {
    console.log('create User Session >>> 1', req.body);

    const _userCourseId = req.body.userCourseId;
    const _sessionStart = req.body.sessionStart;
    const _sessionEnd = req.body.sessionEnd;
    const _sessionCount = req.body.sessionCounter;
    const _unit = req.body.unit;
    const _lesson = req.body.lesson;

    if(!_userCourseId || !_sessionStart || !_sessionEnd || !_sessionCount || !_unit || !_lesson){
        return _sendResponse(
            res,
            400,
            "Missing required fields. Please provide: userCourseId, sessionStart, sessionEnd, unit, lesson and sessionCounter."
        );
    }

    let __userCourseSessionExist = await __userCourseSessionModel.find({
        userCourseId: _userCourseId,
        sessCount: _sessionCount
    });

    console.log("__userCourseSessionExist",__userCourseSessionExist);

    if (__userCourseSessionExist.length > 0) {
        return _sendResponse(res,200,"user session document already exist");
    }else{
        const _insertedData = {
            userCourseId: _userCourseId,
            unit: _unit,
            lesson: _lesson,
            sessStart: _sessionStart,
            sessEnd: _sessionEnd,
            sessCount: _sessionCount
        };

        const __createUserCourseSession = new __userCourseSessionModel(_insertedData);
        const _userCourseSessionData = await __createUserCourseSession.save();
        return _sendResponse(res,201,"New user session document created.",_userCourseSessionData);
    }
};

exports.updateUserCourseSessionEndTime = async(req, res) => {
    console.log('update User SessionEndTime >>> 1', req.body);

    const _userCourseId = req.body.userCourseId;
    const _sessEnd = req.body.sessionEnd;
    const _sessionCount = req.body.sessionCounter;

    if(!_userCourseId || !_sessEnd || !_sessionCount){
        return _sendResponse(res,400,"Missing required fields. Please provide: userCourseId, sessionEnd and sessionCounter.");
    }

    const _filterFields = { userCourseId: _userCourseId, sessCount: _sessionCount };

    const _updateReqField = { sessEnd: _sessEnd };

    let __userCourseSessionExist = await __userCourseSessionModel.find(_filterFields);

    if (__userCourseSessionExist.length > 0) {
        await __userCourseSessionModel.findOneAndUpdate(_filterFields,{ $set: _updateReqField }, { new: true});
        return _sendResponse(res,200,"Successfully updated the user session data.");
    }else{
        return _sendResponse(res,400,"Failed to update the user session data.");
    }
};

exports.getUserCourseSessionDetails = async(req, res) => {
    console.log('get user session data >>> 1', req.params);

    const _userCourseId = req.params.userCourseId;
    const _sessionCount = req.params.sessionCounter;

    if(!_userCourseId || !_sessionCount){
        return _sendResponse(res,400,"Missing required fields. Please provide: userCourseId and sessionCounter.");
    }

    const _filterFields = { userCourseId: _userCourseId, sessCount: _sessionCount };

    const _isCheckUserCourseSessionData = await __userCourseSessionModel.find(_filterFields);

    if (_isCheckUserCourseSessionData.length > 0) {
        return _sendResponse(res,200,"user session data exist",_isCheckUserCourseSessionData);
    }else{
        return _sendResponse(res,400,"user session data does not exist");
    }
};