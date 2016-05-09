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

		models[options.model].model().forge(options.reqParams).fetch()
			.then(function (model) {
					if (model) {
						var result = reply.replyWithData(model.toJSON(), options.fetchFields);
						if (!result.err) {

							if (utils.isValidUser(req.body.pwd, result.data[0], result.data[i])) {
								// set cookie
								if (req.body.rememberName == "on") {
									if (!req.cookies.loginUserName) {
										res.cookie("loginUserName", req.body.userName, {maxAge: 60 * 1000 * 60 * 24 * 30})
									}
								}
								// set session
								//TODO:
								res.redirect("/authorized");
							} else {
								res.send("用户名或密码错误...");
							}
						} else {
							res.send("查找数据失败.....");
						}
					}
				}
			).catch(function () {
			res.send("出错了....");
		})
	}

	else {
		models[options.model].collection().forge(options.reqParams).fetch()
			.then(function (collection) {
				//TODO:
				if (collection) {
					var pageData = reply.replyWithPageData(model.toJSON(), options.fetchFields);
					if (!pageData.err) {
						res.render(options.reqUrl, pageData.data);
					}
				} else {
					res.send("查找数据失败.....");
				}

			}).catch(function () {
			res.send("出错了....");
		})
	}
}
function updateRecord(res, options) {
	models[options.model].model().forge(options.reqParams).fetch()
		.then(function (model) {
				if (model) {
					// change the model
					model.save({}).then(function(){
						res.send("更新数据成功..");
					}).catch(function(){
						res.send("更新数据失败....");
					})
				}
			}
		).catch(function () {
		res.send("更新数据失败....");
	})
}
function deleteRecord(res, options) {
	models[options.model].model().forge(options.reqParams).fetch()
		.then(function (model) {
			if (model) {
				model.destroy().then(function(result){
					if (result) {
						console.log(result);
						res.send("删除成功...");
					}
					else{
						res.send("删除失败...");
					}
				})
			}
		}).catch(function () {
		res.send("删除失败....");
	})
}

function createRecord(res, options) {
	models[options.model].model().forge(options.reqParams).save()
		.then(function (model) {
				if (model) {

					res.send("添加成功...");
				}
			else{
					res.send("添加失败...");
				}


			}
		).catch(function () {
		res.send("添加失败....");
	})
}

controllers = {
	create: function (res, options) {
		createRecord(req, res, options);
	},
	del: function (res, options) {
		deleteRecord(req, res, options);
	},
	update: function (req, res, options) {
		updateRecord(req, res, options);
	},
	fetch: function (req, res, options) {
		getResult(req, res, options);
	}

};

module.exports = controllers;
