/*global require, module */

var _ = require('lodash'),
	api = require('../api'),
	path = require('path'),
	errors = require('../errors'),
	utils = require('../utils'),
	handleError = require('./error'),
	reply = require('./sendResponse'),
	models = require('../models'),
	redisClient = require('redis').createClient(),
	controllers;

function responseResult(res, options) {
	models[options.reqModel].collection().forge().fetch()
		.then(function (collection) {

			if (collection) {

				var pageData = reply.replyWithPageData(collection.toJSON(), options.fetchFields, options.queryCon);
				console.log(pageData);
				res.json(pageData);
			} else {
				res.json({err: true});
			}

		}).catch(function (err) {
		console.log(err);
		// do other things
		res.json({err: true});
	})
}


function getRecord(req, res, options) {

	//handle login
	if (options.reqUrl == 'index') {

		models[options.reqModel].model().forge(options.reqParams).fetch()
			.then(function (model) {
					if (model) {
						var result = reply.replyWithData(model.toJSON(), options.fetchFields);

						if (!result.err) {

							if (utils.checkUser.isValidUser(req.body.pwd, result.data[0], result.data[1])) {
								if (result.data[2] == '冻结') {
									res.send(JSON.stringify({err: true, message: '该用户已被冻结,请联系管理员...'}));
								} else {

									if (req.body.rememberName == "on") {
										if (!req.cookies.loginUserName || (req.cookies.loginUserName != req.body.userName)) {
											// set cookie
											res.cookie("loginUserName", req.body.userName, {maxAge: 60 * 1000 * 60 * 24 * 30})
											console.log(req.cookies);
										}

									} else {
										if (req.cookies.loginUserName) {
											//delete cookie
											res.clearCookie('loginUserName');
										}
									}
									// set session

									req.session.userStatus = "logined";
									//console.log(req.session);
									//console.log("sessionID is "+req.sessionID);




									//redisClient.set("usrID",'ahsfiehfehfhfhfhw');
									//redisClient.get("usrID", function(err, reply) {
									//	console.log(reply);
									//});
									res.send(JSON.stringify({err: false, message: ''}));

								}

							} else {
								res.send(JSON.stringify({err: true, message: '用户名或密码错误...'}));
							}
						} else {
							res.send(JSON.stringify({err: true, message: 'sorry,用户不存在...'}));
						}
					}
				}
			).catch(function (err) {

			console.log(err);
			// do other things
		})
	} else if (options.reqUrl == 'myInfo') {
		models[options.reqModel].model().forge(options.reqParams).fetch()
			.then(function (model) {
				var result = reply.replyWithData(model.toJSON(), options.fetchFields);

				if (!result.err && result.data.length == 5) {
					res.render('myInfo', {
						userName: result.data[0],
						email: utils.postProcess.replaceStr(result.data[1], '*', 2, 3),
						cellphone: utils.postProcess.replaceStr(result.data[2], '*', 3, 4),
						userState: result.data[3],
						unit: result.data[4]
					});
				}

			}).catch(function (err) {
			console.log(err);
		})
	}

	else {
		models[options.reqModel].collection().query().where(options.reqParams).select()
			.then(function (collection) {

				if (collection) {

					var pageData = reply.replyWithPageData(collection, options.fetchFields, options.queryCon);
					console.log(pageData);
					if (options.queryCon.forSearch) {
						res.json(pageData);
					}
					else {
						if (!pageData.err) {
							res.render(options.reqUrl, pageData.data);
						}
					}

				}
			}).catch(function (err) {
			console.log(err);
			// do other things
		})
	}
}

function updateRecord(res, options) {
	models[options.reqModel].model().forge(options.reqParams).fetch()
		.then(function (model) {
				if (model) {
					if (_.isObject(options.reqFields) && !_.isEmpty(options.reqFields)) {
						// change the model
						model.save(options.reqFields).then(function () {
							responseResult(res, options);
						}).catch(function (err) {
							console.log(err);
							// do other things
						})
					}
					else if (_.isString(options.fetchFields) && options.fetchFields.length != 0) {

						if (options.reqUrl == 'changePwd') {
							var keys = options.fetchFields.split(" ");
							var results = model.toJSON();
							var checkResult = utils.checkUser.isValidUser(options.data.oldPassword, results[keys[0]], results[keys[1]]);
							if (checkResult) {
								var newPass = utils.checkUser.cryptPass(options.data.newPassword, results[keys[0]]);
								model.save({user_pass: newPass}).then(function () {
									res.send("success");
								}).catch(function (err) {
									console.log(err);
									// do other things
								})
							}
							else {
								res.send("fail");
							}
						}
					}

				}
			}
		).catch(function (err) {
		console.log(err);

	})
}

function renewAttr(res, options) {
	var model = models[options.reqModel].model();
	var count = 0;
	var length = options.reqParams.length;
	_.forEach(options.reqParams, function (value) {
		model.forge(value).fetch()
			.then(function (model) {
				if (model) {
					model.save(options.saveParams);
					count++;
				}
			})
			.then(function () {
				if (length == count) {
					responseResult(res, options);
				}

			})
	});

}

function deleteRecord(res, options) {


	var model = models[options.reqModel].model();
	var countDeleteInstances = 0;
	var length = options.reqParams.length;
	_.forEach(options.reqParams, function (value) {
		model.forge(value).fetch()
			.then(function (model) {
				if (model) {
					model.destroy();
					countDeleteInstances++;
				}
			})
			.then(function () {
				if (length == countDeleteInstances) {
					responseResult(res, options);
				}

			})
	});


}

function createRecord(res, options) {

	models[options.reqModel].model().forge(options.reqParams).save()
		.then(function (model) {
				if (model) {
					responseResult(res, options);
				}

			}
		).catch(function () {
		res.json({err: true});
	})
}


controllers = {

	create: createRecord,
	del: deleteRecord,
	update: updateRecord,
	fetch: getRecord,
	renewAttr: renewAttr


};

module.exports = controllers;
