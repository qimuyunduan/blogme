// # API routes

var express     = require('express'),
    api         = require('../api'),
	path        = require('path'),
	controller  = require('../controllers'),
	models      = require('../models'),

    routes;

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


		models.idoUser.model().forge({id:50}).fetch().then(function(userData){
			if (!userData) {
				console.log(JSON.stringify({data:userData}));
				return res.json(JSON.stringify({data:userData}));
			}
			else {
				console.log(JSON.stringify(userData));
				return res.json(JSON.stringify(userData));
			}
		});


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
	router.delete("/authorized",function(req,res){
		console.log("render authorized.hbs...");
		console.log(req.body);
		res.send("ok got it! delete"+req.body);
		//res.render('authorized');
	});


    //// ## Posts
    //router.get('/posts',          api.http(api.posts.browse));
	//
    //router.post('/posts',        api.http(api.posts.add));
    //router.get('/posts/:id',      api.http(api.posts.read));
    //router.get('/posts/slug/:slug',  api.http(api.posts.read));
    //router.put('/posts/:id',     api.http(api.posts.edit));
    //router.del('/posts/:id',     api.http(api.posts.destroy));
	//
    //// ## Settings
    //router.get('/settings',  api.http(api.settings.browse));
    //router.get('/settings/:key',  api.http(api.settings.read));
    //router.put('/settings',  api.http(api.settings.edit));
	//
    //// ## Users
    //router.get('/users',  api.http(api.users.browse));
	//
    //router.get('/users/:id',  api.http(api.users.read));
    //router.get('/users/slug/:slug',  api.http(api.users.read));
    //router.get('/users/email/:email',  api.http(api.users.read));
    //router.put('/users/password',  api.http(api.users.changePassword));
    //router.put('/users/owner',  api.http(api.users.transferOwnership));
    //router.put('/users/:id',  api.http(api.users.edit));
    //router.post('/users',  api.http(api.users.add));
    //router.del('/users/:id',  api.http(api.users.destroy));
	//
    //// ## Tags
    //router.get('/tags',  api.http(api.tags.browse));
    //router.get('/tags/:id',  api.http(api.tags.read));
    //router.get('/tags/slug/:slug',  api.http(api.tags.read));
    //router.post('/tags',  api.http(api.tags.add));
    //router.put('/tags/:id',  api.http(api.tags.edit));
    //router.del('/tags/:id',  api.http(api.tags.destroy));
	//
    //// ## Roles
    //router.get('/roles/',  api.http(api.roles.browse));
	//
    //// ## Clients
    //router.get('/clients/slug/:slug', api.http(api.clients.read));
	//
    //// ## Slugs
    //router.get('/slugs/:type/:name',  api.http(api.slugs.generate));
	//
    //// ## Themes
    //router.get('/themes',  api.http(api.themes.browse));
    //router.put('/themes/:name',  api.http(api.themes.edit));
	//
    //// ## Notifications
    //router.get('/notifications',  api.http(api.notifications.browse));
    //router.post('/notifications',  api.http(api.notifications.add));
    //router.del('/notifications/:id',  api.http(api.notifications.destroy));
	//
	//
    //// ## Mail
    //router.post('/mail',  api.http(api.mail.send));
    //router.post('/mail/test',  api.http(api.mail.sendTest));
	//
    //// ## Authentication
    //router.post('/authentication/passwordreset',
    //    middleware.spamPrevention.forgotten,
    //    api.http(api.authentication.generateResetToken)
    //);
    //router.put('/authentication/passwordreset', api.http(api.authentication.resetPassword));
    //router.post('/authentication/invitation', api.http(api.authentication.acceptInvitation));
    //router.get('/authentication/invitation', api.http(api.authentication.isInvitation));
    //router.post('/authentication/setup', api.http(api.authentication.setup));
    //router.put('/authentication/setup',  api.http(api.authentication.updateSetup));
    //router.get('/authentication/setup', api.http(api.authentication.isSetup));
    //router.post('/authentication/token');
    //router.post('/authentication/revoke',  api.http(api.authentication.revoke));
	//
    //// ## Uploads
    //router.post('/uploads',  middleware.busboy, api.http(api.uploads.add));

    // API Router middleware


    return router;
};


//非base model 可以携带自已的函数
module.exports = routes;
