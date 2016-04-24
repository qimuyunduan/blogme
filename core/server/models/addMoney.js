/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/4/13 .
 * Revise person：qimuyunduan
 * Revise Time：16/4/13 下午3:04
 * @version
 *
 */
var _              = require('lodash'),
	Promise        = require('bluebird'),
	errors         = require('../errors'),
	utils          = require('../utils'),
	events         = require('../events'),
	appBookshelf   = require('./base'),
	validator      = require('validator'),

	addmoney_record,
	addmoney_records;

addmoney_record = appBookshelf.Model.extend({

	tableName: 'addmoney_record_detail',


	modelConstants:{
		"totalCount":-1,
		"pageLimit":50,   // per page contains 50 records
		"pageCounts":-1
	},

	findAll: function findAll() {
		var self = this;
		return self.forge().fetchAll().then(function then(collection) {
			self.modelConstants.totalCount = collection.count;
			self.modelConstants.pageCounts = self.countPage(self.modelConstants.totalCount,self.modelConstants.pageLimit);
			return collection;
		});
	},
	countPage:function countPage(totalPage,pageLimit){

		if (pageLimit>0&&totalPage>=0){

			if (totalPage%pageLimit == 0){
				return totalPage/pageLimit;
			}
			else {
				return parseInt(totalPage/pageLimit)+1;
			}
		}
	},
	findPage: function findPage(numPage,messageData) {
		var self  = this;
		var data  = self.findAll();
		var message = messageData===undefined ? "":messageData;
		var currentPage = 1;
		var pages = self.modelConstants.pageCounts;
		var response = new Response();
		var pageNum = 0;

		if (data.count < self.modelConstants.pageLimit) {

			return response.responseData(currentPage,pages,data,message);
		}
		else {
			if(numPage >=1&&numPage<=pages){
				pageNum = numPage-1;
			}
			data = _.chunk(data,self.modelConstants.pageLimit)[pageNum];
			return response.responseData(currentPage,pages,data,message);

		}

	},

	findPrePage:function findPrePage(currentPage){
		var self = this;
		if (currentPage<=1){
			var message = "已经是第一页了...";
			return self.findPage(1,message);
		}
		else{

			return self.findPage(currentPage-1)
		}
	},
	findNextPage:function findNextPage(currentPage,pageLimit){
		var self = this;
		if (currentPage>=self.modelConstants.totalCount){
			var message = "已经是最后一页了...";
			return self.findPage(self.modelConstants.pageCounts,message);
		}
		else{

			return self.findPage(currentPage+1)
		}

	},
	findNumPage:function findNumPage(numPage){
		if (numPage>=1&&numPage<=this.modelConstants.pageCounts){
			return this.findPage(numPage);
		}
	},

	saving: function saving() {

		var self = this;

	},

	validate: function validate() {

	},

	toJSON: function toJSON(options) {
		options = options || {};

		var attrs = appBookshelf.Model.prototype.toJSON.call(this, options);
		// remove password hash for security reasons
		delete attrs.password;

		if (!options || !options.context || (!options.context.user && !options.context.internal)) {
			delete attrs.email;
		}

		return attrs;
	},

	format: function format(options) {
		if (!_.isEmpty(options.website) &&
			!validator.isURL(options.website, {
				require_protocol: true,
				protocols: ['http', 'https']})) {
			options.website = 'http://' + options.website;
		}
		return appBookshelf.Model.prototype.format.call(this, options);
	},

	findOne: function findOne(data, options) {

	},

	edit: function edit(data, options) {

	},

	add: function add(data, options) {

	},

	// Finds the user by email, and checks the password
	check: function check(object) {

	},

	changePassword: function changePassword(object, options) {

	},

	generateResetToken: function generateResetToken(email, expires, dbHash) {
		return this.getByEmail(email).then(function then(foundUser) {
			if (!foundUser) {
				return Promise.reject(new errors.NotFoundError('errors.models.user.noUserWithEnteredEmailAddr'));
			}

			var hash = crypto.createHash('sha256'),
				text = '';

			// Token:
			// BASE64(TIMESTAMP + email + HASH(TIMESTAMP + email + oldPasswordHash + dbHash ))
			hash.update(String(expires));
			hash.update(email.toLocaleLowerCase());
			hash.update(foundUser.get('password'));
			hash.update(String(dbHash));

			text += [expires, email, hash.digest('base64')].join('|');
			return new Buffer(text).toString('base64');
		});
	},

	validateToken: function validateToken(token, dbHash) {

		var tokenText = new Buffer(token, 'base64').toString('ascii'),
			parts,
			expires,
			email;

		parts = tokenText.split('|');

		// Check if invalid structure
		if (!parts || parts.length !== 3) {
			return Promise.reject(new errors.BadRequestError('errors.models.user.invalidTokenStructure'));
		}

		expires = parseInt(parts[0], 10);
		email = parts[1];

		if (isNaN(expires)) {
			return Promise.reject(new errors.BadRequestError('errors.models.user.invalidTokenExpiration'));
		}

		if (expires < Date.now()) {
			return Promise.reject(new errors.ValidationError('errors.models.user.expiredToken'));
		}

		if (tokenSecurity[email + '+' + expires] && tokenSecurity[email + '+' + expires].count >= 10) {
			return Promise.reject(new errors.NoPermissionError('errors.models.user.tokenLocked'));
		}

		return this.generateResetToken(email, expires, dbHash).then(function then(generatedToken) {
			// Check for matching tokens with timing independent comparison
			var diff = 0,
				i;

			// check if the token length is correct
			if (token.length !== generatedToken.length) {
				diff = 1;
			}

			for (i = token.length - 1; i >= 0; i = i - 1) {
				diff |= token.charCodeAt(i) ^ generatedToken.charCodeAt(i);
			}

			if (diff === 0) {
				return email;
			}

			tokenSecurity[email + '+' + expires] = {
				count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1
			};
			return Promise.reject(new errors.BadRequestError('errors.models.user.invalidToken'));
		});
	}

});

addmoney_records= appBookshelf.Collection.extend({
	model:addmoney_record
});

module.exports = {
	addmoney:{
		model: function(){
			return addmoney_record;
		},
		collection:function(){
			return addmoney_records;
		}
	}

};