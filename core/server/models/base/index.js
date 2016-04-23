// # Base Model

var _          = require('lodash'),
    config     = require('../../config'),
    errors     = require('../../errors'),
    moment     = require('moment'),
    Promise    = require('bluebird'),
    utils      = require('../../utils'),
    uuid       = require('node-uuid'),
	Response   = require('./response'),
	nodeEnv    = process.env.NODE_ENV || 'development',
	dbEnv,
    Bookshelf;



dbEnv = config.get(nodeEnv).database;

var knex  = require('knex')(dbEnv);
Bookshelf = require('bookshelf')(knex);

// Load the bookshelf registry plugin, which helps us avoid circular dependencies
Bookshelf.plugin('registry');

// bookshelf.Model
// The Base Model which other App objects will inherit from,
// including some convenience functions as static properties on the model.
Bookshelf.Model = Bookshelf.Model.extend({

	// Fix problems with dates
//    fixDate: function fixDate(attr) {
//        var self = this;
//
//
//        return attr;
//    },
//
//    toJSON: function toJSON() {
//
//    }
//
//}, {
//    // class Utility Functions
//
//	modelConstants:{
//		"totalCount":-1,
//		"pageLimit":50,   // per page contains 50 records
//		"pageCounts":-1
//	},
//
//    findAll: function findAll() {
//		var self = this;
//        return self.forge().fetchAll().then(function then(collection) {
//			self.modelConstants.totalCount = collection.count;
//			self.modelConstants.pageCounts = self.countPage(self.modelConstants.totalCount,self.modelConstants.pageLimit);
//            return collection;
//        });
//    },
//	countPage:function countPage(totalPage,pageLimit){
//
//		if (pageLimit>0&&totalPage>=0){
//
//			if (totalPage%pageLimit == 0){
//				return totalPage/pageLimit;
//			}
//			else {
//				return parseInt(totalPage/pageLimit)+1;
//			}
//		}
//	},
//    findPage: function findPage(numPage,messageData) {
//		var self  = this;
//		var data  = self.findAll();
//		var message = messageData===undefined ? "":messageData;
//		var currentPage = 1;
//		var pages = self.modelConstants.pageCounts;
//		var response = new Response();
//		var pageNum = 0;
//
//		if (data.count < self.modelConstants.pageLimit) {
//
//			return response.responseData(currentPage,pages,data,message);
//		}
//		else {
//			if(numPage >=1&&numPage<=pages){
//				pageNum = numPage-1;
//			}
//			data = _.chunk(data,self.modelConstants.pageLimit)[pageNum];
//			return response.responseData(currentPage,pages,data,message);
//
//		}
//
//    },
//
//	findPrePage:function findPrePage(currentPage){
//		var self = this;
//		if (currentPage<=1){
//			var message = "已经是第一页了...";
//			return self.findPage(1,message);
//		}
//		else{
//
//			return self.findPage(currentPage-1)
//		}
//	},
//	findNextPage:function findNextPage(currentPage,pageLimit){
//		var self = this;
//		if (currentPage>=self.modelConstants.totalCount){
//			var message = "已经是最后一页了...";
//			return self.findPage(self.modelConstants.pageCounts,message);
//		}
//		else{
//
//			return self.findPage(currentPage+1)
//		}
//
//	},
//	findNumPage:function findNumPage(numPage){
//		if (numPage>=1&&numPage<=this.modelConstants.pageCounts){
//			return this.findPage(numPage);
//		}
//	},
//
//
//    findOne: function findOne(data, options) {
//
//        return this.forge(data,options).fetch();
//    },
//
//    edit: function edit(data, options) {
//        var id = options.id;
//
//        return this.forge({id: id}).fetch(options).then(function then(object) {
//            if (object) {
//                return object.save(data, options);
//            }
//        });
//    },
//
//    add: function add(data, options) {
//
//        var model = this.forge(data);
//        // We allow you to disable timestamps when importing posts so that the new posts `updated_at` value is the same
//        // as the import json blob. More details refer to https://github.com/TryApp/App/issues/1696
//        if (options) {
//            model.hasTimestamps = false;
//        }
//        return model.save(null, options);
//    },
//
//    destroy: function destroy(options) {
//        var id = options.id;
//
//        // Fetch the object before destroying it, so that the changed data is available to events
//        return this.forge({id: id}).fetch(options).then(function then(obj) {
//            return obj.destroy(options);
//        });
//    }
});

// base Model 不能携带函数  只能这样
module.exports = Bookshelf;

