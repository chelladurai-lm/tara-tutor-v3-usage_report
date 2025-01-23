let __mongoose = require("mongoose");
let __userCourseHistoryModel = require("../models/userCourseHistoryModel");
let { _sendResponse, _getStatusResponse } = require("../utils/common");

exports.createUserCourseHistory = async(req, res) => {
    console.log('create user course history >>> 1', req.body);

    try {
        const _userCourseId = req.body.userCourseId;        
        const _unit = req.body.unit;
        const _lesson = req.body.lesson;
        const _start_date = req.body.start_date;
        const _end_date = req.body.end_date;
        const _status = req.body.status;
        const _history = req.body.history;

        if(!_userCourseId || !_unit || !_lesson || !_start_date || !_status){
            return _sendResponse(
                res,
                400,
                "Missing required fields. Please provide: userCourseId, unit, lesson, start_date, status, history."
            )
        }

        const _userCourseHistoryExist = await __userCourseHistoryModel.find({
            userCourseId: _userCourseId,
            unit: _unit,
            lesson: _lesson
        });

        if (_userCourseHistoryExist.length) {
            return _sendResponse(res,409,"user course history already exist");
        }else {
            const _userCourseHistory = new __userCourseHistoryModel({
                userCourseId: _userCourseId,
                unit: _unit,
                lesson: _lesson,
                start_date: _start_date,
                end_date: _end_date,
                status: _getStatusResponse(_status),
                history: _history
            });
            const _userCourseHistoryData = await _userCourseHistory.save();
            console.log(_userCourseHistoryData);
            return _sendResponse(res,201,"New user course history document created.",_userCourseHistoryData);
        }

    } catch (error) {
        return _sendResponse(res,500,"An error occurred while creating the course history data. Please try again later.",{error: error.message});
    }

};

exports.updateUserCourseHistory = async(req, res) => {
    console.log('update user course history data >>> 1', req.body);

    try {
        //const { userCourseId, unit, lesson, activityEnd, activityStatus, activityData } = req.body;
        const { userCourseId, unit, lesson, activityData } = req.body;

        if(!userCourseId || !unit || !lesson){
            return _sendResponse(res,400,"Missing required fields. Please provide: userCourseId, unit, lesson.");
        }

        let __filterFields = { userCourseId: userCourseId, unit: unit, lesson: lesson };

        let __updateField = { history: activityData};
        //if (activityData){ __updateField.history = activityData }
        //if (activityEnd){ __updateField.end_date = activityEnd }
        //if (activityStatus){  __updateField.status = activityStatus }

        let __userCourseHistoryExist = await __userCourseHistoryModel.find(__filterFields);

        if (__userCourseHistoryExist.length > 0) {

            if(!activityData){
                return _sendResponse(res,400,"Please provide 'activityData' field to update.");
                //if(!activityData && !activityStatus && !activityEnd){
                //return _sendResponse(res,400,"Please provide at least one field to update: activityEnd, activityStatus, activityData.");
            }

            const _getUserCourseHistoryData = await __userCourseHistoryModel.findByIdAndUpdate(
                __userCourseHistoryExist[0]._id,
                __updateField,
                { new: true }
            );

            return _sendResponse(res,201,"Successfully updated user course history data.",_getUserCourseHistoryData);
            
        }else {
            return _sendResponse(res,404,"User course history data not found for update.");
        }

    } catch (error) {
        return _sendResponse(res,500,`An error occurred while updating the user course history data. Please try again later ${error.message}`);
    }

};

exports.getUserCourseHistory = async(req, res) => {
    console.log('get user course history data  >>> 1', req.query);

    try {

        const _userCourseId = req.query.userCourseId;
        const _unit = req.query.unit;
        const _lesson = req.query.lesson;

        const _filterFields = {
            userCourseId: _userCourseId,
            unit: parseInt(_unit),
            lesson: parseInt(_lesson)
        };

        if(!_userCourseId || !_unit || !_lesson){
            return _sendResponse(res,400,"Missing required fields. Please provide these details to get the data: userCourseId, unit and lesson");
        }

        const _userCourseHistoryExist = await __userCourseHistoryModel.find(_filterFields).populate('userCourseId');

        if(_userCourseHistoryExist.length){
            return _sendResponse(res,200,`user course history data exist`,_userCourseHistoryExist);
        }else{
            return _sendResponse(res,404,`user course history data does not exist.`);
        }


    } catch (error) {
        return _sendResponse(res,500,`An error occurred while getting the course history data. Please try again later ${error.message}`);
    }

};
