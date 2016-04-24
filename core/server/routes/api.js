// # API routes

var express     = require('express'),
    api         = require('../api'),
	controller  = require('../controllers'),
    routes;


function constructOptions(request){

}




routes = function apiRoutes() {

    var router = express.Router();
		

    // alias delete with del
    router.del = router.delete;


	router.get("/",function(req,res){
		var data = {
			title:"风险管理平台"
		};
		res.render("index",data);
	});
	router.get("/index",function(req,res){
		var data = {
			title:"风险管理平台"
		};
		res.render("index",data);
	});//  写路由时要注意把.html包含在内
	router.get("/index.html",function(req,res){
		var data = {
			title:"风险管理平台"
		};
		res.render("index",data);
	});

	router.get("/demo_page1",function(req,res){
		res.render("demo_page1");
	});
    router.get("/authorized",function(req,res){

		console.log(req.body);
		res.render("authorized");


	});
	router.get("/authorized.html",function(req,res){

		console.log(req.body);
		res.render("authorized");


	});
	router.put("/authorized",function(req,res){


	});
	router.post("/authorized",function(req,res){
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
	router.del("/authorized",function(req,res){
		console.log("render authorized.hbs...");
		console.log(req.body);
		res.send("ok got it! delete"+req.body);

	});



    //// ## Settings
    //router.get('/settings',  api.http(api.settings.browse));
    //router.get('/settings/:key',  api.http(api.settings.read));
    //router.put('/settings',  api.http(api.settings.edit));

    //// ## Uploads
    //router.post('/uploads',  middleware.busboy, api.http(api.uploads.add));

    // API Router middleware


    return router;
};


//非base model 可以携带自已的函数
module.exports = routes;
