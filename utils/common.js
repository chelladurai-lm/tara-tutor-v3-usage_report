
const _sendResponse = (aRes, aStatusCode, aMessage, aData = null) => {
    const _reponse = { 
        statusCode : aStatusCode
    };

    if(aMessage){
        _reponse.message = aMessage;
    }

    if(aData){
        _reponse.data = aData;
    }


    return aRes.status(aStatusCode).json(_reponse);
}

const _getStatusResponse = (aStatus) => {

    let _statusCode = "";
    if(aStatus === "inprogress" || aStatus === "Inprogress" || aStatus === "in progress"){
        _statusCode = "IP";
    }else if(aStatus === "completed" || aStatus === "Completed"){
        _statusCode = "CO";
    }else{
        _statusCode = aStatus;
    }

    return _statusCode;
}

module.exports = {
    _sendResponse,
    _getStatusResponse
}