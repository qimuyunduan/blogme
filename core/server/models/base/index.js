// # Base Model
// This is the model from which all other App models extend. The model is based on Bookshelf.Model, and provides
// several basic behaviours such as UUIDs, as well as a set of Data methods for accessing information from the database.
//
// The models are internal to App, only the API and some internal functions such as migration and import/export
// allowed to access data via the API.
var _          = require('lodash'),
    bookshelf  = require('bookshelf'),
    config     = require('../../config'),
    errors     = require('../../errors'),
    moment     = require('moment'),
    Promise    = require('bluebird'),
    utils      = require('../../utils'),
    uuid       = require('node-uuid'),
	nodeEnv    = process.env.NODE_ENV,
	dbEnv,
    appBookshelf;



dbEnv = config.readFile(nodeEnv).database;
var knex = require('knex')(dbEnv);
appBookshelf = bookshelf(knex);

// Load the Bookshelf registry plugin, which helps us avoid circular dependencies
appBookshelf.plugin('registry');

// ## appBookshelf.Model
// The Base Model which other App objects will inherit from,
// including some convenience functions as static properties on the model.
appBookshelf.Model = appBookshelf.Model.extend({

    // Fix problems with dates
    fixDates: function fixDates(attrs) {
        var self = this;

        _.forEach(attrs, function (value, key) {
            if (value !== null) {
                // convert dateTime value into a native javascript Date object
                attrs[key] = moment(value);
            }
        });

        return attrs;
    },

    format: function format(attrs) {
        return this.fixDates(attrs);
    },

    toJSON: function toJSON(attrs) {

    }

}, {
    // class Utility Functions

    findAll: function findAll(options) {
        options = this.filterOptions(options, 'findAll');
        options.withRelated = _.union(options.withRelated, options.include);
        return this.forge().fetchAll(options).then(function then(result) {
            if (options.include) {
                _.each(result.models, function each(item) {
                    item.include = options.include;
                });
            }
            return result;
        });
    },

    findPage: function findPage(options) {
        options = options || {};

        var self = this,
            itemCollection = this.forge(null, {context: options.context}),
            tableName      = _.result(this.prototype, 'tableName');

        // Set this to true or pass ?debug=true as an API option to get output
        itemCollection.debug = options.debug && process.env.NODE_ENV !== 'production';

        // Filter options so that only permitted ones remain
        options = this.filterOptions(options, 'findPage');

        // This applies default properties like 'staticPages' and 'status'
        // And then converts them to 'where' options... this behaviour is effectively deprecated in favour
        // of using filter - it's only be being kept here so that we can transition cleanly.
        this.processOptions(options);

        // Add Filter behaviour
        itemCollection.applyFilters(options);

        // Handle related objects
        // TODO: this should just be done for all methods @ the API level
        options.withRelated = _.union(options.withRelated, options.include);

        // Ensure only valid fields/columns are added to query
        if (options.columns) {
            options.columns = _.intersection(options.columns, this.prototype.permittedAttributes());
        }

        if (options.order) {
            options.order = self.parseOrderOption(options.order, options.include);
        } else {
            options.order = self.orderDefaultOptions();
        }

        return itemCollection.fetchPage(options).then(function formatResponse(response) {
            var data = {};
            data[tableName] = response.collection.toJSON(options);
            data.meta = {pagination: response.pagination};

            return data;
        });
    },

    findOne: function findOne(data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'findOne');
        return this.forge(data, {include: options.include}).fetch(options);
    },

    edit: function edit(data, options) {
        var id = options.id;
        data = this.filterData(data);
        options = this.filterOptions(options, 'edit');

        return this.forge({id: id}).fetch(options).then(function then(object) {
            if (object) {
                return object.save(data, options);
            }
        });
    },

    add: function add(data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'add');
        var model = this.forge(data);
        // We allow you to disable timestamps when importing posts so that the new posts `updated_at` value is the same
        // as the import json blob. More details refer to https://github.com/TryApp/App/issues/1696
        if (options.importing) {
            model.hasTimestamps = false;
        }
        return model.save(null, options);
    },

    destroy: function destroy(options) {
        var id = options.id;
        options = this.filterOptions(options, 'destroy');

        // Fetch the object before destroying it, so that the changed data is available to events
        return this.forge({id: id}).fetch(options).then(function then(obj) {
            return obj.destroy(options);
        });
    }
});

// Export Bookshelf for use elsewhere
module.exports = appBookshelf;
