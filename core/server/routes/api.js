// # API routes

var _       = require('lodash'),
	express = require('express'),
	api     = require('../api'),
	utils   = require('../utils'),
	controller = require('../controllers'),
	routes;
var changeRecord = [];
function constructFetchParams(reqParams, requestFields, filter) {
	var fetchParas = {};
	if (!_.isEmpty(requestFields)) {

		var values = reqParams.Data ? _.values(reqParams.Data):_.values(reqParams);

		//filter some values
		if (filter) {

			if (_.isArray(filter) && !_.isEmpty(filter)) {

				var result = utils.filters.filterArray(values, filter);
				if (result) {
					var resultLength = result.length;
					if (requestFields.length == resultLength) {
						//compact fetParas
						fetchParas = utils.filters.compactObj(_.zipObject(requestFields, result));
						if(reqParams.queryCon){
							return {data:reqParams.Data,reqParams:fetchParas,queryCon:reqParams.queryCon};
						}
						else{ // eg: changePwd.html
							return {data:reqParams,reqParams:fetchParas};
						}

					}
				}
			}
		}
		else {//  get myInfo.html
			if (requestFields.length == values.length) {
				fetchParas = _.zipObject(requestFields, values);
				return {reqParams:fetchParas};
			}
		}

	}else{// eg://get bbm_assureUnit.html
		return{data:{},reqParams:{},queryCon:reqParams}
	}
	return false;
}




function constructPostParams(reqBody,fields) {

	if(_.isObject(reqBody)&& !_.isEmpty(reqBody)){

		var values = _.values(reqBody.Data);
		if(_.isArray(fields)&&!_.isEmpty(fields)&&values.length == fields.length){
			var params = _.zipObject(fields,values);
			return _.assign({reqParams:params},{queryCon:reqBody.queryCon});
		}
	}else {
		return false;
	}

}

function constructPutParams(reqBody,fields){
	if(_.isObject(reqBody)&& !_.isEmpty(reqBody)){
		var values = _.values(reqBody.Data);
		var fetchValues = values.slice(1);
		if(fetchValues.length==fields.length){
			var obj = _.zipObject(fields,fetchValues);
			return _.assign({reqParams:{id:values[0]},reqFields:obj},{queryCon:reqBody.queryCon});
		}
	}else {
		return false;
	}

}


function constructDeleteParams(params,queryCon){
	if(_.isArray(params)&& !_.isEmpty(params)){

		return _.assign({reqParams:params},{queryCon:queryCon});

	}else {
		return false;
	}


}

function consOptions(reqParams, model, fetchFields, url) {

	if(_.isObject(reqParams)&&!_.isEmpty(reqParams)){
		if (_.isString(model) && (_.isArray(fetchFields)|| _.isString(fetchFields))) {

			if(url){
				return _.assign(reqParams, {reqModel: model, fetchFields: fetchFields, reqUrl: url});
			}
			else{
				return _.assign(reqParams, {reqModel: model, fetchFields: fetchFields});
			}


		}
	}
	return false;

}

function responseHomePage(req, res) {

	var data = {title: "爱都信息管理平台"};
	if (req.cookies.loginUserName) {
		data.userName = req.cookies.loginUserName;
	}

	res.render("index", data);
}

function  setDefaultPageReqParas(containCheckbox){
	if(containCheckbox){
		return {numPerPage:50,currentPage:0,containCheckbox:true,forSearch:false};
	}
	else{
		return {numPerPage:50,currentPage:0,containCheckbox:true,forSearch:false};
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

			var queryOptions = consOptions(constructFetchParams(req.body, ['user_name'], [0]), "idoUser", ['user_salt', 'user_pass'], 'index');

			if (!_.isEmpty(queryOptions)) {

				controller.fetch(req, res, queryOptions);
			}

		});

	router.route("/authorized")
		.get(function (req, res) {

			if (!req.session.user_id) {
				console.log("not login");
				res.redirect('/');
			} else {
				console.log(req.session.user_id);
				var dateTime = utils.moment.localDateAndTime;
				res.render("authorized", {dateTime: dateTime});
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
			if(userName){
				var queryOptions = consOptions(constructFetchParams({userName:userName}, ['user_name']), "idoUser", ['user_name', 'user_email','user_phone','user_status','user_unit'], 'myInfo');
				if (!_.isEmpty(queryOptions)) {

					controller.fetch(req,res, queryOptions);
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
			var fetchFields = ['id','unit_code','unit_name','contact_name','contact_mobile','contact_email','del_tag','unit_address','unit_remark'];
			if(_.keys(req.query).length==1){

				var DefaultPageReqParas = setDefaultPageReqParas();
				var queryOptions = consOptions(constructFetchParams(DefaultPageReqParas, [], []), "insuredUnit",fetchFields , 'bbm_assureUnit');
				//console.log(queryOptions);
				if (!_.isEmpty(queryOptions)) {
					controller.fetch(req,res, queryOptions);
				}

			}else{
				var options = consOptions(constructFetchParams(req.query, ['unit_code','unit_name'], [0,1]), "insuredUnit", fetchFields);
				//console.log(options);
				if (!_.isEmpty(options)) {
					controller.fetch(req,res,options);
				}
			}
		})
		.post(function (req, res) {
			req.body.Data.superCompany = parseInt(req.body.Data.superCompany);
			var fields   = ['unit_code','unit_name','contact_name','contact_mobile','contact_email', 'unit_parent_id','del_tag','unit_address'];
			var fetchFields = fields.concat(['id']);
			var options = consOptions(constructPostParams(req.body,fields),"insuredUnit",fetchFields);
			if (!_.isEmpty(options)) {
				controller.create(res, options);
			}

		})
		.put(function (req, res) {

			if(_.values(req.body.Data)!=changeRecord){
				var fields   = ['unit_code','unit_name','contact_name','contact_mobile','contact_email','del_tag','unit_address','unit_remark'];
				var fetchFields = fields.concat(['id']);
				var options = consOptions(constructPutParams(req.body,fields),"insuredUnit",fetchFields);
				//console.log(options);
				if (!_.isEmpty(options)) {
					controller.update(res, options);
				}
			}

		})
		.delete(function (req, res) {
			var params = utils.filters.filterArrays(req.body.Data,[0],['id']);
			var fetchFields   = ['id','unit_code','unit_name','contact_name','contact_mobile','contact_email', 'unit_parent_id','del_tag','unit_address'];
			var options = consOptions(constructDeleteParams(params,req.body.queryCon),"insuredUnit",fetchFields);
			//console.log(options);
			if (!_.isEmpty(options)) {
				controller.del(res, options);
			}

		});


	router.route('/bbm_updateAssureUnit.html')
		.get(function(req,res){
			if(!_.isEmpty(changeRecord)){
				res.render('bbm_updateAssureUnit',{ID:changeRecord[0],number:changeRecord[1],insureUnit:changeRecord[2],contactPerson:changeRecord[3]});
				changeRecord = [];
			}else{
				res.render('bbm_updateAssureUnit');
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
			res.render("bbm_sysUser");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

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
	router.route("/om_review.html")
		.get(function (req, res) {
			res.render("om_review");
		});

	//// ## Uploads
	//router.post('/uploads',  middleware.busboy, api.http(api.uploads.add));

	// API Router middleware


	return router;
};


//非base model 可以携带自已的函数
module.exports = routes;
