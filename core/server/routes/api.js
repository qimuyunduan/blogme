// # API routes

var _           = require('lodash'),
	express     = require('express'),
    api         = require('../api'),
	utils       = require('../utils'),
	controller  = require('../controllers'),
	routes;

function  constructFetchParams(reqParams,requestFields,filter){
	var fetchParas = {};
	if(_.isObject(reqParams)&& _.isArray(requestFields)){
		var values = _.values(reqParams);
		//filter some values
		if(filter){

			if(_.isArray(filter)&&!_.isEmpty(filter)){
				var result = utils.filters.filterArray(values,filter);
				if(result){
					if(requestFields.length==result.length){
						fetchParas = _.zipObject(requestFields,result);
						return fetchParas;
					}
				}
			}
		}
		else {

			if(requestFields.length==values.length){
				fetchParas = _.zipObject(requestFields,values);
				return fetchParas;
			}
		}
		return false;
	}
}


function consOptions(reqParams,model,fetchFields,url){
	var options={};
	if(_.isObject(reqParams)&&! _.isEmpty(reqParams)){
		options={reqParams:reqParams};
	}
	if(_.isString(model)&&_.isArray(fetchFields)&&_.isString(url)){
		if(model.length&&url.length){
			_.assign(options,{reqModel:model,fetchFields:fetchFields,reqUrl:url})
		}

	}
	return options;
}

function responseHomePage(req,res){

	var data={title: "爱都信息管理平台"};
	if(req.cookies.loginUserName){
		data.userName=req.cookies.loginUserName;
	}

	res.render("index", data);
}


routes = function apiRoutes() {

    var router = express.Router();

	///pc  routes

	router.get("/",function(req,res){
		responseHomePage(req,res);
	});
	router.get("/index.html",function(req,res){
		responseHomePage(req,res);
	});
	router.route("/index")
		.get(function (req, res) {
			responseHomePage(req,res)
		})
		.post(function (req, res) {

			var queryOptions = consOptions(constructFetchParams(req.body,['user_name'],[0]), "idoUser",['user_salt','user_pass'],'index');
			if(!_.isEmpty(queryOptions)){

				controller.fetch(req,res,queryOptions);
			}

		});


    router.route("/authorized")
		.get(function(req,res){

			if (!req.session.user_id) {
				console.log("not login");
				res.redirect('/');
			} else {
				console.log(req.session.user_id);
				var dateTime = utils.moment.localDateAndTime;
				res.render("authorized",{dateTime:dateTime});
			}

		});


	router.route("/changePwd.html")
		.get(function (req, res) {
			res.render("changePwd");
		})
		.put(function (req, res) {

	});


	router.route("/myInfo.html")
		.get(function (req, res) {
			var data = {
				userName: "fwege",
				userRealName: "gewgg",
				email: "gewgweg",
				cellphone: "hrretw35234",
				userState: "343fef",
				unit: "bbrrag"
			};
			res.render("myInfo", data);
		});




	//routes for bbm modules
	
	router.get("/bbm_addDrugCategory.html",function(req,res){

		res.render("bbm_addDrugCategory");

	});

	router.get("/bbm_addInsureCompany.html",function(req,res){

		res.render("bbm_addInsureCompany");

	});
	router.get("/bbm_addInsureCompanyDic.html",function(req,res){

		res.render("bbm_addInsureCompanyDic");

	});
	router.get("/bbm_addInsureOrder.html",function(req,res){

		res.render("bbm_addInsureOrder");

	});

	router.get("/bbm_addInsureUser.html",function(req,res){

		res.render("bbm_addInsureUser");

	});

	router.get("/bbm_addRecharge.html",function(req,res){

		res.render("bbm_addRecharge");

	});

	router.get("/bbm_addShop.html",function(req,res){

		res.render("bbm_addShop");

	});

	router.get("/bbm_addShoper.html",function(req,res){

		res.render("bbm_addShoper");

	});

	router.get("/bbm_addShoperUserManage.html",function(req,res){

		res.render("bbm_addShoperUserManage");

	});

	router.get("/bbm_addShopGroup.html",function(req,res){

		res.render("bbm_addShopGroup");

	});

	router.get("/bbm_addShopGroupManage.html",function(req,res){

		res.render("bbm_addShopGroupManage");

	});

	router.get("/bbm_addSubcompany.html",function(req,res){

		res.render("bbm_addSubcompany");

	});

	router.get("/bbm_addSysUser.html",function(req,res){

		res.render("bbm_addSysUser.html");

	});

	router.get("/bbm_addUserManage.html",function(req,res){

		res.render("bbm_addUserManage");

	});

	
	router.get("/bbm_assureUnit.html",function(req,res){
		console.log(req.body);
		res.render("bbm_assureUnit");

	});
	router.route("/bbm_assureUnit")
		.get(function (req, res) {

			var data = controller.Q(constructOptions(req.query, []));
			res.render("bbm_assureUnit", data);
			console.log(req.query);

		});


	router.get("/bbm_attachmentManage.html",function(req,res){

		res.render("bbm_attachmentManage");

	});

	router.get("/bbm_drugCategory.html",function(req,res){

		res.render("bbm_drugCategory");

	});

	router.get("/bbm_freezeCompany.html",function(req,res){

		res.render("bbm_freezeCompany");

	});

	router.get("/bbm_freezeUser.html",function(req,res){

		res.render("bbm_freezeUser");

	});

	router.get("/bbm_importRecords.html",function(req,res){

		res.render("bbm_importRecords");

	});

	router.get("/bbm_insureCompany.html",function(req,res){

		res.render("bbm_insureCompany");

	});

	router.get("/bbm_insureCompanyDic.html",function(req,res){

		res.render("bbm_insureCompanyDic");

	});

	router.get("/bbm_insureUser.html",function(req,res){
		res.render("bbm_insureUser");
	});

	router.get("/bbm_logoutCompany.html",function(req,res){
		res.render("bbm_logoutCompany");
	});

	router.get("/bbm_logoutUser.html",function(req,res){
		res.render("bbm_logoutUser");
	});

	router.get("/bbm_orderMaintain.html",function(req,res){
		res.render("bbm_orderMaintain");
	});

	router.get("/bbm_queryChangeRecord.html",function(req,res){
		res.render("bbm_queryChangeRecord");
	});
	router.get("/bbm_assureUnit.html",function(req,res){
		res.render("bbm_shjs");
	});

	router.get("/bbm_shoperManage.html",function(req,res){
		res.render("bbm_shoperManage");
	});

	router.get("/bbm_shoperUserManage.html",function(req,res){
		res.render("bbm_shoperUserManage");
	});

	router.get("/bbm_shopGroup.html",function(req,res){
		res.render("bbm_shopGroup");
	});

	router.get("/bbm_shopManage.html",function(req,res){
		res.render("bbm_shopManage");
	});

	router.get("/bbm_shopUserManage.html",function(req,res){
		res.render("bbm_shopUserManage");
	});

	router.get("/bbm_subCompany.html",function(req,res){
		res.render("bbm_subCompany");
	});

	router.get("/bbm_sysUser.html",function(req,res){
		res.render("bbm_sysUser");
	});

	router.get("/bbm_addInsureUnit.html",function(req,res){
		res.render("bbm_addInsureUnit");
	});

	router.get("/bbm_uploadFile.html",function(req,res){
		res.render("bbm_uploadFile");
	});

	router.get("/bbm_userManage.html",function(req,res){
		res.render("bbm_userManage");
	});


	//routes for bc modules
	router.route("/bc_addAssociateShoper.html")
		.get(function(req,res){
		res.render("bc_addAssociateShoper");
	});
	router.route("/bc_addHomeUser.html")
		.get(function(req,res){
		res.render("bc_addHomeUser");
	});
	router.route("/bc_addSpecialOrder.html")
		.get(function(req,res){
		res.render("bc_addSpecialOrder");
	});
	router.route("/bc_homeUser.html")
		.get(function(req,res){
		res.render("bc_homeUser");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

	});

	router.route("/bc_inputConsumeNumber.html")
		.get(function(req,res){
		res.render("bc_inputConsumeNumber");
	});
	router.route("/bc_orderManage.html")
		.get(function(req,res){
		res.render("bc_orderManage");
		})
		.delete(function (req, res) {

	});
	router.route("/bc_recharge.html")
		.get(function(req,res){
		res.render("bc_recharge");
		})
		.post(function (req, res) {

		})
		.delete(function (req, res) {

	});
	router.route("/bc_signContract.html")
		.get(function(req,res){
		res.render("bc_signContract");
		})
		.post(function (req, res) {

	});
	router.route("/bc_specialOrder.html")
		.get(function(req,res){
			res.render("bc_specialOrder");
		})
		.post(function (req, res) {

		})
		.put(function (req, res) {

		})
		.delete(function (req, res) {

		});
	router.route("/bc_specialOrderManage.html")
		.get(function(req,res){
		res.render("bc_specialOrderManage");
	});
	router.route("/bc_yiliaoConsumeManage.html")
		.get(function(req,res){
		res.render("bc_yiliaoConsumeManage");
	});
	router.route("/bc_yiliaofare.html")
		.get(function(req,res){
		res.render("bc_yiliaofare");

	});

	//routes for bm modules

	router.route("/bm_currentMonth.html")
		.get(function(req,res){
		res.render("bm_currentMonth");
	});
	router.route("/bm_historyBill.html")
		.get(function(req,res){
		res.render("bm_historyBill");
	});
	router.route("/bm_todayBill.html")
		.get(function(req,res){
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
		.get(function(req,res){
		res.render("ps_addMenu");
	});
	router.route("/ps_addRole.html")
		.get(function(req,res){
		res.render("ps_addRole");
	});
	router.route("/ps_addUserClass.html")
		.get(function(req,res){
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
		.get(function(req,res){
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
		.get(function(req,res){
		res.render("om_review");
});

    //// ## Uploads
    //router.post('/uploads',  middleware.busboy, api.http(api.uploads.add));

    // API Router middleware


    return router;
};


//非base model 可以携带自已的函数
module.exports = routes;
