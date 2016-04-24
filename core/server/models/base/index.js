// # Base Model

var _          = require('lodash'),
    config     = require('../../config'),
	nodeEnv    = process.env.NODE_ENV || 'development',
	dbEnv,
    Bookshelf;

dbEnv = config.get(nodeEnv).database;

var knex  = require('knex')(dbEnv);
Bookshelf = require('bookshelf')(knex);

// Load the bookshelf registry plugin, which helps us avoid circular dependencies
Bookshelf.plugin('registry');

// base Model 不能携带函数  只能这样
module.exports = Bookshelf;

