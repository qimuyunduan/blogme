// # API routes

var _           = require('lodash'),
	express     = require('express'),
	api         = require('../api'),
	utils       = require('../utils'),
	config      = require('../config'),
	middleware  = require('../middleware'),
	controller  = require('../controllers'),
	fs          = require('fs-extra'),
	redisClient = require('redis').createClient(),
	routes;
var changeRecord = [];

function constructFetchParams(reqParams, requestFields, filter) {
	var fetchParas = {};
	if (!_.isEmpty(requestFields)) {

		var values = reqParams.Data ? _.values(reqParams.Data) : _.values(reqParams);

		//filter some values
		if (filter) {

			if (_.isArray(filter) && !_.isEmpty(filter)) {

				var result = utils.filters.filterArray(values, filter);
				if (result) {
					var resultLength = result.length;
					if (requestFields.length == resultLength) {
						//compact fetParas
						fetchParas = utils.filters.compactObj(_.zipObject(requestFields, result));
						if (reqParams.queryCon) {
							return {data: reqParams.Data, reqParams: fetchParas, queryCon: reqParams.queryCon};
						}
						else { // eg: changePwd.html
							return {data: reqParams, reqParams: fetchParas};
						}

					}
				}
			}
		}
		else {//  get myInfo.html
			if (requestFields.length == values.length) {
				fetchParas = _.zipObject(requestFields, values);
				return {reqParams: fetchParas};
			}
		}

	} else {// eg://get bbm_assureUnit.html
		return {data: {}, reqParams: {}, queryCon: reqParams}
	}
	return false;
}

function constructPostParams(reqBody, fields) {

	if (_.isObject(reqBody) && !_.isEmpty(reqBody)) {

		var values = _.values(reqBody.Data);
		if (_.isArray(fields) && !_.isEmpty(fields) && values.length == fields.length) {
			var params = _.zipObject(fields, values);
			return _.assign({reqParams: params}, {queryCon: reqBody.queryCon});
		}
	} else {
		return false;
	}

}

function constructPutParams(reqBody, fields) {
	if (_.isObject(reqBody) && !_.isEmpty(reqBody)) {
		var values = _.values(reqBody.Data);
		var fetchValues = values.slice(1);
		if (fetchValues.length == fields.length) {
			var obj = _.zipObject(fields, fetchValues);
			return _.assign({reqParams: {id: values[0]}, reqFields: obj}, {queryCon: reqBody.queryCon});
		}
	} else {
		return false;
	}

}

function constructDeleteParams(params, queryCon) {
	if (_.isArray(params) && !_.isEmpty(params)) {

		return _.assign({reqParams: params}, {queryCon: queryCon});

	} else {
		return false;
	}


}

function consOptions(reqParams, model, fetchFields, url) {

	if (_.isObject(reqParams) && !_.isEmpty(reqParams)) {
		if (_.isString(model) && (_.isArray(fetchFields) || _.isString(fetchFields))) {

			if (url) {
				return _.assign(reqParams, {reqModel: model, fetchFields: fetchFields, reqUrl: url});
			}
			else {
				return _.assign(reqParams, {reqModel: model, fetchFields: fetchFields});
			}


		}
	}
	return false;

}

function constructUpdateOptions(reqData, model, queryFields, saveObj, fetchFields) {
	var length = reqData.data[0].length;
	var reqParams = [];
	_.forEach(reqData.data, function (itemArr) {
		if (length == queryFields.length) {
			reqParams.push(_.zipObject(queryFields, itemArr));
		}
	});
	return {
		reqParams: reqParams,
		reqModel: model,
		saveParams: saveObj,
		fetchFields: fetchFields,
		queryCon: reqData.queryCon
	}
}

function responseHomePage(req, res) {

	var data = {title: "爱都信息管理平台"};
	if (req.cookies.loginUserName) {
		data.userName = req.cookies.loginUserName;
	}

	res.render("index", data);
}

function setDefaultPageReqParas(contendID,containCheckbox) {

	if (containCheckbox) {
		return {contentID:contendID,numPerPage: 50, currentPage: 0, containCheckbox: false, forSearch: false};
	}
	else {
		return {contentID:contendID,numPerPage: 50, currentPage: 0, containCheckbox: true, forSearch: false};
	}

}
routes = function apiRoutes() {

	var router = express.Router();

	///pc  routes

	router.get("/", function (req, res) {

		responseHomePage(req, res);
	});
	router.get("/index.html", function (req, res) {
		responseHomePage(req, res);
	});
	router.route("/index")
		.get(function (req, res) {
			responseHomePage(req, res)
		})
		.post(function (req, res) {

			var queryOptions = consOptions(constructFetchParams(req.body, ['user_name'], [0]), "idoUser", ['user_salt', 'user_pass','user_status'], 'index');

			if (!_.isEmpty(queryOptions)) {

				controller.fetch(req, res, queryOptions);
			}

		});

	router.route("/authorized")
		.get(function (req, res) {

			//req.session.status = "logined";
			//console.log(req.session.status);
			var userName = req.cookies.loginUserName;
			redisClient.hgetall(userName,function(err,obj){
				if(obj.status == "logined"){
					var dateTime = utils.moment.localDateAndTime;
					res.render("authorized", {dateTime: dateTime});
				}
				else{
					res.redirect('/');
				}
			});

		})
		.post(function(req,res){

			if(req.body.info=='logout'){
				req.session.destroy();
				res.end();
			}
		});


	router.route("/changePwd.html")
		.get(function (req, res) {
			res.render("changePwd");
		})
		.put(function (req, res) {
			var queryOptions = consOptions(constructFetchParams(req.body, ['user_name'], [3]), "idoUser", 'user_salt user_pass', 'changePwd');
			if (!_.isEmpty(queryOptions)) {

				controller.update(res, queryOptions);
			}
		});


	router.route("/myInfo.html")
		.get(function (req, res) {
			var userName = req.cookies.loginUserName;
			if (userName) {
				var queryOptions = consOptions(constructFetchParams({userName: userName}, ['user_name']), "idoUser", ['user_name', 'user_email', 'user_phone', 'user_status', 'user_unit'], 'myInfo');
				if (!_.isEmpty(queryOptions)) {

					controller.fetch(req, res, queryOptions);
				}
			}

		});


	//routes for bbm modules
	
	router.route("/bbm_addDrugCategory.html")
		.get(function (req, res) {
			res.render("bbm_addDrugCategory");

		});

	router.route("/bbm_addInsureCompany.html")
		.get(function (req, res) {
			res.render("bbm_addInsureCompany");

		});
	router.route("/bbm_addInsureCompanyDic.html")
		.get(function (req, res) {
			res.render("bbm_addInsureCompanyDic");
		});
	router.route("/bbm_addInsureOrder.html")
		.get(function (req, res) {
			res.render("bbm_addInsureOrder");
		});

	router.route("/bbm_addInsureUser.html")
		.get(function (req, res) {
			res.render("bbm_addInsureUser");
		});

	router.route("/bbm_addRecharge.html")
		.get(function (req, res) {
			res.render("bbm_addRecharge");

		});

	router.route("/bbm_addShop.html")
		.get(function (req, res) {
			res.render("bbm_addShop");

		});

	router.route("/bbm_addShoper.html")
		.get(function (req, res) {
			res.render("bbm_addShoper");

		});

	router.route("/bbm_addShoperUserManage.html")
		.get(function (req, res) {
			res.render("bbm_addShoperUserManage");

		});

	router.route("/bbm_addShopGroup.html")
		.get(function (req, res) {
			res.render("bbm_addShopGroup");

		});

	router.route("/bbm_addShopGroupManage.html")
		.get(function (req, res) {
			res.render("bbm_addShopGroupManage");
		});

	router.route("/bbm_addSubcompany.html")
		.get(function (req, res) {
			res.render("bbm_addSubcompany");

		});

	router.route("/bbm_addSysUser.html")
		.get(function (req, res) {
			res.render("bbm_addSysUser.html");

		});

	router.route("/bbm_addUserManage.html")
		.get(function (req, res) {
			res.render("bbm_addUserManage");

		});


	router.route("/bbm_assureUnit.html")

		.get(function (req, res) {
			var fetchFields = ['id', 'unit_code', 'unit_name', 'contact_name', 'contact_mobile', 'contact_email', 'del_tag', 'unit_address', 'unit_remark'];
			if (_.keys(req.query).length == 1) {

				var DefaultPageReqParas = setDefaultPageReqParas('bbm_assureUnitTbody');
				var queryOptions = consOptions(constructFetchParams(DefaultPageReqParas, [], []), "insuredUnit", fetchFields, 'bbm_assureUnit');
				//.log(queryOptions);
				if (!_.isEmpty(queryOptions)) {
					controller.fetch(req, res, queryOptions);
				}

			} else {
				var options = consOptions(constructFetchParams(req.query, ['unit_code', 'unit_name'], [0, 1]), "insuredUnit", fetchFields);
				//console.log(options);
				if (!_.isEmpty(options)) {
					controller.fetch(req, res, options);
				}
			}
		})
		.post(function (req, res) {
			var fields = ['unit_code', 'unit_name', 'contact_name', 'contact_mobile', 'contact_email', 'unit_parent_id', 'del_tag', 'unit_address'];
			var fetchFields = ['id'].concat(fields);
			fetchFields=utils.filters.shuffleArray(fetchFields,[6]);
			fetchFields.push('unit_remark');
			console.log(fetchFields);
			var options = consOptions(constructPostParams(req.body, fields), "insuredUnit", fetchFields);
			if (!_.isEmpty(options)) {
				//console.log(options);
				controller.create(res, options);
			}

		})
		.put(function (req, res) {

			if (_.values(req.body.Data) != changeRecord) {
				var fields = ['unit_code', 'unit_name', 'contact_name', 'contact_mobile', 'contact_email', 'del_tag', 'unit_address', 'unit_remark'];
				var fetchFields = ['id'].concat(fields);
				var options = consOptions(constructPutParams(req.body, fields), "insuredUnit", fetchFields);
				//console.log(options);
				if (!_.isEmpty(options)) {
					controller.update(res, options);
				}
			}

		})
		.delete(function (req, res) {
			var params = utils.filters.filterArrays(req.body.Data, [0], ['id']);
			var fetchFields = ['id', 'unit_code', 'unit_name', 'contact_name', 'contact_mobile', 'contact_email', 'unit_parent_id', 'del_tag', 'unit_address'];
			var options = consOptions(constructDeleteParams(params, req.body.queryCon), "insuredUnit", fetchFields);
			//console.log(options);
			if (!_.isEmpty(options)) {
				controller.del(res, options);
			}

		});


	router.route('/bbm_updateAssureUnit.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bbm_updateAssureUnit', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3],
					phoneNumber:changeRecord[4],
					email:changeRecord[5],
					address:changeRecord[7],
					detail:changeRecord[8]

				});
				changeRecord = [];
			} else {
				res.render('bbm_updateAssureUnit');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/bbm_updateShoper.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bbm_updateShoper', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('bbm_updateShoper');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/bbm_updateInsureCompany.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bbm_updateInsureCompany', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('bbm_updateInsureCompany');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/bbm_updateInsureOrder.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bbm_updateInsureOrder', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('bbm_updateInsureOrder');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/bbm_updateInsureUser.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bbm_updateInsureUser', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('bbm_updateInsureUser');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});

	router.route('/bc_updateHomeUser.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bc_updateHomeUser', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('bc_updateHomeUser');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/mm_updateVersion.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('mm_updateVersion', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('mm_updateVersion');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/mm_updateCityAD.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('mm_updateCityAD', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('mm_updateCityAD');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/mm_updateShopConfig.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('mm_updateShopConfig', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('mm_updateShopConfig');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/ps_updateMenu.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('ps_updateMenu', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('ps_updateMenu');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/ps_updateRole.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('ps_updateRole', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('ps_updateRole');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/ps_updateUserClass.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('ps_updateUserClass', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('ps_updateUserClass');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/pm_updateParams.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('pm_updateParams', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('pm_updateParams');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});
	router.route('/pm_updateParam.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('pm_updateParam', {
					ID: changeRecord[0],
					number: changeRecord[1],
					insureUnit: changeRecord[2],
					contactPerson: changeRecord[3]
				});
				changeRecord = [];
			} else {
				res.render('pm_updateParam');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		});

	router.route("/bbm_attachmentManage.html")
		.get(function (req, res) {

			res.render("bbm_attachmentManage");

		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_drugCategory.html")
		.get(function (req, res) {
			res.render("bbm_drugCategory");

		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_freezeCompany.html")
		.get(function (req, res) {

			res.render("bbm_freezeCompany");
		})
		.put(function (req, res) {

		});

	router.route("/bbm_freezeUser.html")
		.get(function (req, res) {

			res.render("bbm_freezeUser");
		})
		.put(function (req, res) {

		});

	router.route("/bbm_importRecords.html")
		.get(function (req, res) {
			res.render("bbm_importRecords");

		});

	router.route("/bbm_insureCompany.html")
		.get(function (req, res) {
			res.render("bbm_insureCompany");

		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_insureCompanyDic.html")
		.get(function (req, res) {

			res.render("bbm_insureCompanyDic");

		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_insureUser.html")
		.get(function (req, res) {
			res.render("bbm_insureUser");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_logoutCompany.html")
		.get(function (req, res) {
			res.render("bbm_logoutCompany");
		});

	router.route("/bbm_logoutUser.html")
		.get(function (req, res) {
			res.render("bbm_logoutUser");
		});

	router.route("/bbm_orderMaintain.html")
		.get(function (req, res) {
			res.render("bbm_orderMaintain");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_queryChangeRecord.html")
		.get(function (req, res) {
			res.render("bbm_queryChangeRecord");
		});
	router.route("/bbm_assureUnit.html")
		.get(function (req, res) {
			res.render("bbm_assureUnit");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_shoperManage.html")
		.get(function (req, res) {
			res.render("bbm_shoperManage");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_shoperUserManage.html")
		.get(function (req, res) {
			res.render("bbm_shoperUserManage");
		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_shopGroup.html")
		.get(function (req, res) {
			res.render("bbm_shopGroup");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});


	router.route("/bbm_shopManage.html")
		.get(function (req, res) {
			res.render("bbm_shopManage");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_shopUserManage.html")
		.get(function (req, res) {
			res.render("bbm_shopUserManage");
		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_subCompany.html")
		.get(function (req, res) {
			res.render("bbm_subCompany");
		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bbm_sysUser.html")
		.get(function (req, res) {
			var fetchFields = ['id', 'user_name', 'user_type', 'user_unit', 'user_status', 'user_phone', 'user_email', 'user_address'];
			if (_.keys(req.query).length == 1) {

				var DefaultPageReqParas = setDefaultPageReqParas('bbm_sysUserTbody');
				var queryOptions = consOptions(constructFetchParams(DefaultPageReqParas, [], []), "idoUser", fetchFields, 'bbm_sysUser');
				//console.log(queryOptions);
				if (!_.isEmpty(queryOptions)) {
					controller.fetch(req, res, queryOptions);
				}

			} else {
				var options = consOptions(constructFetchParams(req.query, ['user_name', 'user_type', 'user_unit', 'user_status'], [0, 1, 2, 3]), "idoUser", fetchFields);
				console.log(options);
				if (!_.isEmpty(options)) {
					controller.fetch(req, res, options);
				}
			}
		})
		.post(function (req, res) {

			var fields = ['user_name', 'user_type', 'user_unit', 'user_status', 'user_phone', 'user_email', 'user_address'];
			var fetchFields = ['id'].concat(fields);
			var options = consOptions(constructPostParams(req.body, fields), "idoUser", fetchFields);
			_.assign(options.reqParams, utils.checkUser.newUser());

			if (!_.isEmpty(options)) {
				//console.log(options);
				controller.create(res, options);

			}


		})
		.put(function (req, res) {
			if (_.values(req.body.Data) != changeRecord) {
				var fields = ['user_name', 'user_type', 'user_unit', 'user_status', 'user_phone', 'user_email', 'user_address'];
				var fetchFields = ['id'].concat(fields);
				//console.log(req.body);
				var options = consOptions(constructPutParams(req.body, fields), "idoUser", fetchFields);
				//console.log(options);
				if (!_.isEmpty(options)) {
					controller.update(res, options);
				}
			}
		})
		.delete(function (req, res) {
			var params = utils.filters.filterArrays(req.body.Data, [0], ['id']);
			var fetchFields = ['id', 'user_name', 'user_type', 'user_unit', 'user_status', 'user_phone', 'user_email', 'user_address'];
			var options = consOptions(constructDeleteParams(params, req.body.queryCon), "idoUser", fetchFields);
			console.log(options);
			if (!_.isEmpty(options)) {
				controller.del(res, options);
			}
		});
	router.route('/bbm_updateSysUser.html')
		.get(function (req, res) {
			if (!_.isEmpty(changeRecord)) {
				res.render('bbm_updateSysUser', {
					ID: changeRecord[0],
					userName: changeRecord[1],
					unit: changeRecord[3],
					phone: changeRecord[5],
					email: changeRecord[6],
					address: changeRecord[7]
				});
				changeRecord = [];
			} else {
				res.render('bbm_updateSysUser');
			}

		})
		.put(function (req, res) {
			changeRecord = req.body.data[0];
			res.end();
		})
		.post(function (req, res) {

			var saveObj ;
			if(req.body.state){
				saveObj = {user_status:req.body.state};
			}else{
				saveObj = utils.checkUser.newUser();
			}
			var fetchFields = ['id', 'user_name', 'user_type', 'user_unit', 'user_status', 'user_phone', 'user_email', 'user_address'];
			var options = constructUpdateOptions(req.body,'idoUser',['id'],saveObj,fetchFields);
			//console.log(options);
			if(options){

				controller.renewAttr(res,options);
			}
		});


	router.route("/bbm_addInsureUnit.html")
		.get(function (req, res) {
			res.render("bbm_addInsureUnit");
		});

	router.route("/bbm_uploadFile.html")
		.get(function (req, res) {
			res.render("bbm_uploadFile");
		});

	router.route("/bbm_userManage.html")
		.get(function (req, res) {
			res.render("bbm_userManage");
		});


	//routes for bc modules
	router.route("/bc_addAssociateShoper.html")
		.get(function (req, res) {
			res.render("bc_addAssociateShoper");
		});
	router.route("/bc_addHomeUser.html")
		.get(function (req, res) {
			res.render("bc_addHomeUser");
		});
	router.route("/bc_addSpecialOrder.html")
		.get(function (req, res) {
			res.render("bc_addSpecialOrder");
		});
	router.route("/res/data/file.xls")
		.get(function (req, res) {

			res.download(config.paths.dataPath, 'file.xls');

		});
	router.route("/bc_homeUser.html")
		.get(function (req, res) {
			res.render("bc_homeUser");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	router.route("/bc_inputConsumeNumber.html")
		.get(function (req, res) {
			res.render("bc_inputConsumeNumber");
		});
	router.route("/bc_orderManage.html")
		.get(function (req, res) {
			res.render("bc_orderManage");
		})
		.delete(function (req, res) {

		});
	router.route("/bc_recharge.html")
		.get(function (req, res) {
			res.render("bc_recharge");
		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

		});
	router.route("/bc_signContract.html")
		.get(function (req, res) {
			res.render("bc_signContract");
		})
		.post(function (req, res) {

		});
	router.route("/bc_specialOrder.html")
		.get(function (req, res) {
			res.render("bc_specialOrder");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});
	router.route("/bc_specialOrderManage.html")
		.get(function (req, res) {
			res.render("bc_specialOrderManage");
		});
	router.route("/bc_yiliaoConsumeManage.html")
		.get(function (req, res) {
			res.render("bc_yiliaoConsumeManage");
		});
	router.route("/bc_yiliaofare.html")
		.get(function (req, res) {
			res.render("bc_yiliaofare");

		});

	//routes for bm modules

	router.route("/bm_currentMonth.html")
		.get(function (req, res) {
			res.render("bm_currentMonth");
		});
	router.route("/bm_historyBill.html")
		.get(function (req, res) {
			res.render("bm_historyBill");
		});
	router.route("/bm_todayBill.html")
		.get(function (req, res) {
			res.render("bm_todayBill");
		});


	//routes for mm modules

	router.route("/mm_addCityAD.html")
		.get(function (req, res) {
			res.render("mm_addCityAD");
		});
	router.route("/mm_addVersion.html")
		.get(function (req, res) {
			res.render("mm_addVersion");
		});
	router.route("/mm_cityAD.html")
		.get(function (req, res) {
			res.render("mm_cityAD");
		});
	router.route("/mm_feedback.html")
		.get(function (req, res) {
			res.render("mm_feedback");
		})
		.delete(function (req, res) {

		});
	router.route("/mm_shopConfig.html")
		.get(function (req, res) {
			res.render("mm_shopConfig");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		});
	router.route("/mm_versionManage.html")
		.get(function (req, res) {
			res.render("mm_versionManage");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});


	//routes for ps modules

	router.route("/ps_addMenu.html")
		.get(function (req, res) {
			res.render("ps_addMenu");
		});
	router.route("/ps_addRole.html")
		.get(function (req, res) {
			res.render("ps_addRole");
		});
	router.route("/ps_addUserClass.html")
		.get(function (req, res) {
			res.render("ps_addUserClass");
		});

	router.route("/ps_menuManage.html")
		.get(function (req, res) {
			res.render("ps_menuManage");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});
	router.route("/ps_roleManage.html")
		.get(function (req, res) {
			res.render("ps_roleManage");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});
	router.route("/ps_userAuthorize.html")
		.get(function (req, res) {
			res.render("ps_userAuthorize");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});

	//routes for pm modules

	router.route("/pm_addParam.html")
		.get(function (req, res) {
			res.render("pm_addParam");
		});
	router.route("/pm_addParams.html")
		.get(function (req, res) {
			res.render("pm_addParams");
		});
	router.route("/pm_cacheList.html")
		.get(function (req, res) {
			res.render("pm_cacheList");
		});
	router.route("/pm_paramList.html")
		.get(function (req, res) {
			res.render("pm_paramList");
		})
		.post(function (req, res) {
		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});
	router.route("/pm_paramManage.html")
		.get(function (req, res) {
			res.render("pm_paramManage");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});


	//routes for om modules

	router.route("/om_fileManage.html")
		.get(function (req, res) {
			res.render("om_fileManage");
		})
		.delete(function (req, res) {

		});

	router.route("/om_log.html")
		.get(function (req, res) {
			res.render("om_log");
		})
		.delete(function (req, res) {

		});

	// ## Uploads
	router.post('/uploads',function(req,res){
			console.log(req.body);
			var fieldName = req.body.fieldname;
			api.uploads.single(fieldName);
			res.send({err:false});
		});

	router.post('/deleteUploads',function(req,res){
		console.log(req.body);
		var filePath = req.body.name.path;
		fs.remove(filePath, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.end();
	});
	router.post('/testMail',function(req,res){
		api.mail.send({},res);
	});

	// mobile api



	return router;
};


//非base model 可以携带自已的函数
module.exports = routes;
