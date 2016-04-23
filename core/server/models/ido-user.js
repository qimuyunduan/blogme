var _              = require('lodash'),
    Promise        = require('bluebird'),
    errors         = require('../errors'),
    utils          = require('../utils'),
	events         = require('../events'),
	bookshelf      = require('./base'),
	validator      = require('validator'),
    bcrypt         = require('bcryptjs'),
    crypto         = require('crypto'),

    bcryptGenSalt  = Promise.promisify(bcrypt.genSalt),
    bcryptHash     = Promise.promisify(bcrypt.hash),
    bcryptCompare  = Promise.promisify(bcrypt.compare),

    tokenSecurity  = {},
    ido_user,
    ido_users;

//function validatePasswordLength(password) {
//    return validator.isLength(password, 8);
//}
//
//function generatePasswordHash(password) {
//    // Generate a new salt
//    return bcryptGenSalt().then(function (salt) {
//        // Hash the provided password with bcrypt
//        return bcryptHash(password, salt);
//    });
//}

ido_user = bookshelf.Model.extend({

	tableName: 'ido_user'

    //saving: function saving() {
	//
    //    var self = this;
	//
    //},
	//
    //validate: function validate() {
	//
    //},
	//
    //toJSON: function toJSON(options) {
    //    options = options || {};
	//
    //    var attrs = bookshelf.Model.prototype.toJSON.call(this, options);
    //    // remove password hash for security reasons
    //    delete attrs.password;
	//
    //    if (!options || !options.context || (!options.context.user && !options.context.internal)) {
    //        delete attrs.email;
    //    }
	//
    //    return attrs;
    //},
	//
    //format: function format(options) {
    //    if (!_.isEmpty(options.website) &&
    //        !validator.isURL(options.website, {
    //        require_protocol: true,
    //        protocols: ['http', 'https']})) {
    //        options.website = 'http://' + options.website;
    //    }
    //    return bookshelf.Model.prototype.format.call(this, options);
    //},
	//
    //findOne: function findOne( data,options) {
		//	console.log("search user from ido_user...");
		//	bookshelf.Model.findOne(data,options);
    //},
	//
    //edit: function edit(data, options) {
    //    var self = this,
    //        roleId;
	//
    //    if (data.roles && data.roles.length > 1) {
    //        return Promise.reject(
    //            new errors.ValidationError('errors.models.user.onlyOneRolePerUserSupported')
    //        );
    //    }
	//
    //    options = options || {};
    //    options.withRelated = _.union(options.withRelated, options.include);
	//
    //    return bookshelf.Model.edit.call(this, data, options).then(function then(user) {
    //        if (!data.roles) {
    //            return user;
    //        }
	//
    //        roleId = parseInt(data.roles[0].id || data.roles[0], 10);
	//
    //        return user.roles().fetch().then(function then(roles) {
    //            // return if the role is already assigned
    //            if (roles.models[0].id === roleId) {
    //                return;
    //            }
    //            return bookshelf.model('Role').findOne({id: roleId});
    //        }).then(function then(roleToAssign) {
    //            if (roleToAssign && roleToAssign.get('name') === 'Owner') {
    //                return Promise.reject(
    //                    new errors.ValidationError('errors.models.user.methodDoesNotSupportOwnerRole')
    //                );
    //            } else {
    //                // assign all other roles
    //                return user.roles().updatePivot({role_id: roleId});
    //            }
    //        }).then(function then() {
    //            options.status = 'all';
    //            return self.findOne({id: user.id}, options);
    //        });
    //    });
    //},
	//
    //add: function add(data, options) {
    //    var self = this,
    //        userData = this.filterData(data),
    //        roles;
	//
    //    options = this.filterOptions(options, 'add');
    //    options.withRelated = _.union(options.withRelated, options.include);
	//
    //    // check for too many roles
    //    if (data.roles && data.roles.length > 1) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.onlyOneRolePerUserSupported'));
    //    }
	//
    //    if (!validatePasswordLength(userData.password)) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.passwordDoesNotComplyLength'));
    //    }
	//
    //    function getAuthorRole() {
    //        return bookshelf.model('Role').findOne({name: 'Author'}, _.pick(options, 'transacting')).then(function then(authorRole) {
    //            return [authorRole.get('id')];
    //        });
    //    }
	//
    //    roles = data.roles || getAuthorRole();
    //    delete data.roles;
	//
    //    return generatePasswordHash(userData.password).then(function then(hash) {
    //        // Assign the hashed password
    //        userData.password = hash;
    //        // LookupGravatar
    //        return gravatar.lookup(userData);
    //    }).then(function then(userData) {
    //        // Save the user with the hashed password
    //        return bookshelf.Model.add.call(self, userData, options);
    //    }).then(function then(addedUser) {
    //        // Assign the userData to our created user so we can pass it back
    //        userData = addedUser;
    //        // if we are given a "role" object, only pass in the role ID in place of the full object
    //        return Promise.resolve(roles).then(function then(roles) {
    //            roles = _.map(roles, function mapper(role) {
    //                if (_.isString(role)) {
    //                    return parseInt(role, 10);
    //                } else if (_.isNumber(role)) {
    //                    return role;
    //                } else {
    //                    return parseInt(role.id, 10);
    //                }
    //            });
	//
    //            return addedUser.roles().attach(roles, options);
    //        });
    //    }).then(function then() {
    //        // find and return the added user
    //        return self.findOne({id: userData.id, status: 'all'}, options);
    //    });
    //},
	//
    //// Finds the user by email, and checks the password
    //check: function check(object) {
    //    var self = this,
    //        s;
    //    return this.getByEmail(object.email).then(function then(user) {
    //        if (!user) {
    //            return Promise.reject(new errors.NotFoundError('errors.models.user.noUserWithEnteredEmailAddr'));
    //        }
    //        if (user.get('status') === 'invited' || user.get('status') === 'invited-pending' ||
    //                user.get('status') === 'inactive'
    //            ) {
    //            return Promise.reject(new errors.NoPermissionError('errors.models.user.userIsInactive'));
    //        }
    //        if (user.get('status') !== 'locked') {
    //            return bcryptCompare(object.password, user.get('password')).then(function then(matched) {
    //                if (!matched) {
    //                    return Promise.resolve(self.setWarning(user, {validate: false})).then(function then(remaining) {
    //                        s = (remaining > 1) ? 's' : '';
    //                        return Promise.reject(new errors.UnauthorizedError('errors.models.user.incorrectPasswordAttempts'));
	//
    //                        // Use comma structure, not .catch, because we don't want to catch incorrect passwords
    //                    }, function handleError(error) {
    //                        // If we get a validation or other error during this save, catch it and log it, but don't
    //                        // cause a login error because of it. The user validation is not important here.
    //                        errors.logError(
    //                            error,
    //                            'errors.models.user.userUpdateError.context',
    //                           'errors.models.user.userUpdateError.help'
    //                        );
    //                        return Promise.reject(new errors.UnauthorizedError('errors.models.user.incorrectPassword'));
    //                    });
    //                }
	//
    //                return Promise.resolve(user.set({status: 'active', last_login: new Date()}).save({validate: false}))
    //                    .catch(function handleError(error) {
    //                        // If we get a validation or other error during this save, catch it and log it, but don't
    //                        // cause a login error because of it. The user validation is not important here.
    //                        errors.logError(
    //                            error,
    //                            'errors.models.user.userUpdateError.context',
    //                            'errors.models.user.userUpdateError.help'
    //                        );
    //                        return user;
    //                    });
    //            }, errors.logAndThrowError);
    //        }
    //        return Promise.reject(new errors.NoPermissionError(
    //            'errors.models.user.accountLocked'));
    //    }, function handleError(error) {
    //        if (error.message === 'NotFound' || error.message === 'EmptyResponse') {
    //            return Promise.reject(new errors.NotFoundError('errors.models.user.noUserWithEnteredEmailAddr'));
    //        }
	//
    //        return Promise.reject(error);
    //    });
    //},
	//
    //changePassword: function changePassword(object, options) {
    //    var self = this,
    //        newPassword = object.newPassword,
    //        ne2Password = object.ne2Password,
    //        userId = object.user_id,
    //        oldPassword = object.oldPassword,
    //        user;
	//
    //    if (newPassword !== ne2Password) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.newPasswordsDoNotMatch'));
    //    }
	//
    //    if (userId === options.context.user && _.isEmpty(oldPassword)) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.passwordRequiredForOperation'));
    //    }
	//
    //    if (!validatePasswordLength(newPassword)) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.passwordDoesNotComplyLength'));
    //    }
	//
    //    return self.forge({id: userId}).fetch({require: true}).then(function then(_user) {
    //        user = _user;
    //        if (userId === options.context.user) {
    //            return bcryptCompare(oldPassword, user.get('password'));
    //        }
    //        // if user is admin, password isn't compared
    //        return true;
    //    }).then(function then(matched) {
    //        if (!matched) {
    //            return Promise.reject(new errors.ValidationError('errors.models.user.incorrectPassword'));
    //        }
	//
    //        return generatePasswordHash(newPassword);
    //    }).then(function then(hash) {
    //        return user.save({password: hash});
    //    });
    //},
	//
    //generateResetToken: function generateResetToken(email, expires, dbHash) {
    //    return this.getByEmail(email).then(function then(foundUser) {
    //        if (!foundUser) {
    //            return Promise.reject(new errors.NotFoundError('errors.models.user.noUserWithEnteredEmailAddr'));
    //        }
	//
    //        var hash = crypto.createHash('sha256'),
    //            text = '';
	//
    //        // Token:
    //        // BASE64(TIMESTAMP + email + HASH(TIMESTAMP + email + oldPasswordHash + dbHash ))
    //        hash.update(String(expires));
    //        hash.update(email.toLocaleLowerCase());
    //        hash.update(foundUser.get('password'));
    //        hash.update(String(dbHash));
	//
    //        text += [expires, email, hash.digest('base64')].join('|');
    //        return new Buffer(text).toString('base64');
    //    });
    //},
	//
    //validateToken: function validateToken(token, dbHash) {
	//
    //    var tokenText = new Buffer(token, 'base64').toString('ascii'),
    //        parts,
    //        expires,
    //        email;
	//
    //    parts = tokenText.split('|');
	//
    //    // Check if invalid structure
    //    if (!parts || parts.length !== 3) {
    //        return Promise.reject(new errors.BadRequestError('errors.models.user.invalidTokenStructure'));
    //    }
	//
    //    expires = parseInt(parts[0], 10);
    //    email = parts[1];
	//
    //    if (isNaN(expires)) {
    //        return Promise.reject(new errors.BadRequestError('errors.models.user.invalidTokenExpiration'));
    //    }
	//
    //    if (expires < Date.now()) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.expiredToken'));
    //    }
	//
    //    if (tokenSecurity[email + '+' + expires] && tokenSecurity[email + '+' + expires].count >= 10) {
    //        return Promise.reject(new errors.NoPermissionError('errors.models.user.tokenLocked'));
    //    }
	//
    //    return this.generateResetToken(email, expires, dbHash).then(function then(generatedToken) {
    //        // Check for matching tokens with timing independent comparison
    //        var diff = 0,
    //            i;
	//
    //        // check if the token length is correct
    //        if (token.length !== generatedToken.length) {
    //            diff = 1;
    //        }
	//
    //        for (i = token.length - 1; i >= 0; i = i - 1) {
    //            diff |= token.charCodeAt(i) ^ generatedToken.charCodeAt(i);
    //        }
	//
    //        if (diff === 0) {
    //            return email;
    //        }
	//
    //        tokenSecurity[email + '+' + expires] = {
    //            count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1
    //        };
    //        return Promise.reject(new errors.BadRequestError('errors.models.user.invalidToken'));
    //    });
    //},
	//
    //resetPassword: function resetPassword(options) {
    //    var self = this,
    //        token = options.token,
    //        newPassword = options.newPassword,
    //        ne2Password = options.ne2Password,
    //        dbHash = options.dbHash;
	//
    //    if (newPassword !== ne2Password) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.newPasswordsDoNotMatch'));
    //    }
	//
    //    if (!validatePasswordLength(newPassword)) {
    //        return Promise.reject(new errors.ValidationError('errors.models.user.passwordDoesNotComplyLength'));
    //    }
	//
    //    // Validate the token; returns the email address from token
    //    return self.validateToken(utils.decodeBase64URLsafe(token), dbHash).then(function then(email) {
    //        // Fetch the user by email, and hash the password at the same time.
    //        return Promise.join(
    //            self.getByEmail(email),
    //            generatePasswordHash(newPassword)
    //        );
    //    }).then(function then(results) {
    //        if (!results[0]) {
    //            return Promise.reject(new errors.NotFoundError('errors.models.user.userNotFound'));
    //        }
	//
    //        // Update the user with the new password hash
    //        var foundUser = results[0],
    //            passwordHash = results[1];
	//
    //        return foundUser.save({password: passwordHash, status: 'active'});
    //    });
    //},
	//
    //getByEmail: function getByEmail(email, options) {
    //    options = options || {};
	//
    //    options.require = true;
	//
    //    return Users.forge(options).fetch(options).then(function then(users) {
    //        var userWithEmail = users.find(function findUser(user) {
    //            return user.get('email').toLowerCase() === email.toLowerCase();
    //        });
    //        if (userWithEmail) {
    //            return userWithEmail;
    //        }
    //    });
    //}
});


ido_users = bookshelf.Collection.extend({
    model: ido_user
});

module.exports = {
	idoUser:{
		model: function(){
			return ido_user;
		},
		collection:function(){
			return ido_users;
		}
	}

};
