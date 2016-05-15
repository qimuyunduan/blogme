/*global require, module */

var _ = require('lodash'),
	api = require('../api/index'),
	path = require('path'),
	errors = require('../errors/index'),
	utils = require('../utils'),
	handleError = require('./error'),
	reply = require('./sendResponse'),
	setRequestIsSecure = require('./secure'),
	models = require('../models'),
	controllers;

function getResult(req, res, options) {

	//handle login
	if (options.reqUrl == 'index') {

		models[options.reqModel].model().forge(options.reqParams).fetch()
			.then(function (model) {
					if (model) {
						console.log(model.toJSON());
						var result = reply.replyWithData(model.toJSON(), options.fetchFields);

						if (!result.err) {

							if (utils.checkUser.isValidUser(req.body.pwd, result.data[0], result.data[1])) {
								// set cookie
								if (req.body.rememberName == "on") {
									if (!req.cookies.loginUserName) {
										res.cookie("loginUserName", req.body.userName, {maxAge: 60 * 1000 * 60 * 24 * 30})
									}
								}
								// set session
								req.session.user_id = 'login';

								res.send("success");
							} else {
								res.send('fail');
							}
						} else {
							res.send('fail');
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
						email: utils.postProcess.replaceStr(result.data[1],'*',2,3),
						cellphone: utils.postProcess.replaceStr(result.data[2],'*',3,4),
						userState: result.data[3],
						unit: result.data[4]
					});
				}

			}).catch(function(err){
			console.log(err);
		})
	}

	else {
		models[options.reqModel].collection().query().where(options.reqParams).select()
			.then(function (collection) {

				if (collection) {

					var pageData = reply.replyWithPageData(collection, options.fetchFields,options.data);
					if(options.data.forSearch){
						res.send(JSON.stringify(pageData));
					}
					else{
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
					if (_.isObject(options.fetchFields) && !_.isEmpty(options.fetchFields)) {

						// change the model
						model.save(options.fetchFields).then(function () {
							res.send(JSON.stringify({err:false}));
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
		// do other things
	})
}
function deleteRecord(res, options) {
	models[options.reqModel].model().forge(options.reqParams).fetch()
		.then(function (model) {
			if (model) {
				model.destroy().then(function (result) {
					if (result) {
						console.log(result);
						res.send(JSON.stringify({err:false}));
					}
					else {
						res.send(JSON.stringify({err:true}));
					}
				})
			}
		}).catch(function () {
		res.send(JSON.stringify({err:true}));
	})
}

function createRecord(res, options) {

	models[options.reqModel].model().forge(options.reqParams).save()
		.then(function (model) {
				if (model) {
					console.log(model);
					res.send(JSON.stringify({err:false}));
				}
				else {
					res.send(JSON.stringify({err:true}));
				}
			}
		).catch(function () {
		res.send(JSON.stringify({err:true}));
	})
}

controllers = {

	create: createRecord,
	del: deleteRecord,
	update: updateRecord,
	fetch: getResult

};

module.exports = controllers;
