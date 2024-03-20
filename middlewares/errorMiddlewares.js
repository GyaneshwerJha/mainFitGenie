function errorHandler(statusCode, err, req, res, next) {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    console.log("Error Middleware called");
    res.status(statusCode || 500).json({
        ok: false,
        message: err.message
    });
}

module.exports = errorHandler;