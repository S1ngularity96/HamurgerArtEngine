exports.successResponse = function (res, msg) {
	var data = {
		status: 200,
		message: msg
	};
	return res.status(200).json(data);
};

/**
 * 
 * @param {*} res 
 * @param {String} msg 
 * @param {Object | Array} data 
 */
exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: 200,
		message: msg,
		data
	};
	return res.status(200).json(resData);
};

/**
 * 
 * @param {*} res 
 * @param {String | String[]} msg
 */
exports.BadRequestResponse = function (res, msg) {
	var data = {
		status: 400,
		message: Array().concat(msg)
	};
	return res.status(400).json(data);
};

/**
 * 
 * @param {*} res 
 * @param {String | String[]} msg
 */
exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 401,
		message: Array().concat(msg)
	};
	return res.status(401).json(data);
};
/**
 * 
 * @param {*} res 
 * @param {String | String[]} msg
 */
exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 404,
		message: Array().concat(msg)
	};
	return res.status(404).json(data);
};

/**
 *
 * @param {*} res
 * @param {String | String[]} msg
 */
exports.ErrorResponse = function (res, msg) {
	var data = {
		status: 500,
		message: Array().concat(msg)
	};
	return res.status(500).json(data);
};

/**
 *
 * @param {*} res
 * @param {String | String[]} msg
 * @param {Object | Object[]} data
 */
exports.ErrorResponseWithData = function (res, msg, data) {
	var resData = {
		status: 500,
		message: Array().concat(msg),
		data
	};
	return res.status(500).json(resData);
};


exports.successDownload = function (res, filepath) {
	return res.status(200).download(filepath);
}