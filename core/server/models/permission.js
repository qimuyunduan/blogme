var Bookshelf = require('./base'),

    Permission,
    Permissions;

Permission = Bookshelf.Model.extend({

    tableName: 'permissions',

    roles: function roles() {
        return this.belongsToMany('Role');
    },

    users: function users() {
        return this.belongsToMany('User');
    },

    apps: function apps() {
        return this.belongsToMany('App');
    }
});

Permissions = Bookshelf.Collection.extend({
    model: Permission
});

module.exports = {
    Permission: Bookshelf.model('Permission', Permission),
    Permissions: Bookshelf.collection('Permissions', Permissions)
};
