
const apiResponse = (res, status, message, data) => {
    return res.status(status).json({
        success: true,
        message: message,
        data: data,
    });
};

const apiError = (res, status, message, data) => {
    return res.status(status).json({
        success: false,
        message: message,
        data: data,
    });
};

module.exports = {
    apiResponse,
    apiError,
};
