// # API routes

var express     = require('express'),
    api         = require('../api'),
	controller  = require('../controllers'),
	utils      = require('../utils'),
	routes;


function constructOptions(request){

}




routes = function apiRoutes() {

    var router = express.Router();
		

    // alias delete with del
    router.del = router.delete;

	///pc  routes

	router.get("/",function(req,res){
		var data = {
			title:"爱都信息管理平台"
		};
		res.render("index",data);
	});
	router.get("/index",function(req,res){
		var data = {
			title:"爱都信息管理平台"
		};
		res.render("index",data);
	});
	router.get("/index.html",function(req,res){
		var data = {
			title:"爱都信息管理平台"
		};
		res.render("index",data);
	});
	router.get("/authorized",function(req,res){

		var dateTime = utils.moment.localDateAndTime;
		res.render("authorized",{dateTime:dateTime});
	});

    router.post("/authorized",function(req,res){

		console.log(req);
		res.render("authorized");
	});

	router.post("/authorized.html",function(req,res){
		console.log("render authorized.hbs...");

		var gather = {
			id : 1314,
			name : "pom",
			ih : {
				age : 20,
				sex : 'man',
				marry : false,
				identity : 622421,
				habit : ['篮球','台球','乒乓球','游戏',true]
			},
			family : ['妈妈','爸爸','弟弟'],
			likeGames : ['PCgame','Netgame']

		};

		res.json(JSON.stringify(gather));
	});


	router.get("/changePwd.html",function(req,res){
		res.render("changePwd");
	});


	router.get("/myInfo.html",function(req,res){
		var data = {userName:"fwege",userRealName:"gewgg",email:"gewgweg",cellphone:"hrretw35234",userState:"343fef",unit:"bbrrag"};
			res.render("myInfo",data);
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
	router.get("/bbm_assureUnit",function(req,res){
		console.log(req.query.insureNumber);
		console.log(req.query.insureUnit);
		//res.render("bbm_assureUnit");
		res.send("get it");
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
	router.get("/bc_addAssociateShoper.html",function(req,res){
		res.render("bc_addAssociateShoper");
	});
	router.get("/bc_addHomeUser.html",function(req,res){
		res.render("bc_addHomeUser");
	});
	router.get("/bc_addSpecialOrder.html",function(req,res){
		res.render("bc_addSpecialOrder");
	});
	router.get("/bc_homeUser.html",function(req,res){
		res.render("bc_homeUser");
	});
	router.get("/bc_inputConsumeNumber.html",function(req,res){
		res.render("bc_inputConsumeNumber");
	});
	router.get("/bc_orderManage.html",function(req,res){
		res.render("bc_orderManage");
	});
	router.get("/bc_recharge.html",function(req,res){
		res.render("bc_recharge");
	});
	router.get("/bc_signContract.html",function(req,res){
		res.render("bc_signContract");
	});
	router.get("/bc_specialOrder.html",function(req,res){
		res.render("bc_specialOrder");
	});
	router.get("/bc_specialOrderManage.html",function(req,res){
		res.render("bc_specialOrderManage");
	});
	router.get("/bc_yiliaoConsumeManage.html",function(req,res){
		res.render("bc_yiliaoConsumeManage");
	});
	router.get("/bc_yiliaofare.html",function(req,res){
		res.render("bc_yiliaofare");

	});

	//routes for bm modules

	router.get("/bm_currentMonth.html",function(req,res){
		res.render("bm_currentMonth");
	});
	router.get("/bm_historyBill.html",function(req,res){
		res.render("bm_historyBill");
	});
	router.get("/bm_todayBill.html",function(req,res){
		res.render("bm_todayBill");
	});


	//routes for mm modules

	router.get("/mm_addCityAD.html",function(req,res){
		res.render("mm_addCityAD");
	});
	router.get("/mm_addVersion.html",function(req,res){
		res.render("mm_addVersion");
	});
	router.get("/mm_cityAD.html",function(req,res){
		res.render("mm_cityAD");
	});
	router.get("/mm_maintain.html",function(req,res){
		res.render("mm_maintain");
	});
	router.get("/mm_shopConfig.html",function(req,res){
		res.render("mm_shopConfig");
	});
	router.get("/mm_versionManage.html",function(req,res){
		res.render("mm_versionManage");
	});


	//routes for ps modules

	router.get("/ps_addMenu.html",function(req,res){
		res.render("ps_addMenu");
	});
	router.get("/ps_addRole.html",function(req,res){
		res.render("ps_addRole");
	});
	router.get("/ps_addUserClass.html",function(req,res){
		res.render("ps_addUserClass");
	});
	router.get("/ps_menuManage.html",function(req,res){
		res.render("ps_menuManage");
	});
	router.get("/ps_roleManage.html",function(req,res){
		res.render("ps_roleManage");
	});
	router.get("/ps_userAuthorize.html",function(req,res){
		res.render("ps_userAuthorize");
	});

	//routes for pm modules

	router.get("/pm_addParam.html",function(req,res){
		res.render("pm_addParam");
	});
	router.get("/pm_addParams.html",function(req,res){
		res.render("pm_addParams");
	});
	router.get("/pm_cacheList.html",function(req,res){
		res.render("pm_cacheList");
	});
	router.get("/pm_paramList.html",function(req,res){
		res.render("pm_paramList");
	});
	router.get("/pm_paramManage.html",function(req,res){
		res.render("pm_paramManage");
	});


	//routes for om modules

	router.get("/om_fileManage.html",function(req,res){
		console.log(req.body);
		res.render("om_fileManage");

	});
	router.get("/om_log.html",function(req,res){
		console.log(req.body);
		res.render("om_log");

	});
	router.get("/om_review.html",function(req,res){
		console.log(req.body);
		res.render("om_review");

	});

    //// ## Uploads
    //router.post('/uploads',  middleware.busboy, api.http(api.uploads.add));

    // API Router middleware


    return router;
};


//非base model 可以携带自已的函数
module.exports = routes;
