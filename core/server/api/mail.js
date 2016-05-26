// # Mail API
// API for sending Mail
var _             = require('lodash').runInContext(),
    Promise       = require('bluebird'),
    pipeline      = require('../utils/pipeline'),
    config        = require('../config'),
    errors        = require('../errors'),
    GhostMail     = require('../mail'),
    Models        = require('../models'),
    utils         = require('./utils'),
    path          = require('path'),
    fs            = require('fs'),
    templatesDir  = path.resolve(__dirname, '..', 'mail', 'templates'),
    htmlToText    = require('html-to-text'),
    readFile      = Promise.promisify(fs.readFile),
    docName       = 'mail',
    mode          = process.env.NODE_ENV,
    testing       = mode !== 'production' && mode !== 'development',
    mailer,
    mail;

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

/**
 * Send mail helper
 */

function sendMail(object) {
    if (!(mailer instanceof GhostMail) || testing) {
        mailer = new GhostMail();
    }

    return mailer.send(object.mail[0].message).catch(function (err) {
        if (mailer.state.usingDirect) {
            notifications.add({notifications: [{
                type: 'warn',
                message: [
                    'warnings.index.unableToSendEmail',
					 'common.seeLinkForInstructions'

                ].join(' ')
            }]}, {context: {internal: true}});
        }

        return Promise.reject(new errors.EmailError(err.message));
    });
}

mail = {
    /**
     * Send an email
     */
    send: function (object, options) {
        var tasks;

        function formatResponse(data) {
            delete object.mail[0].options;
            // Sendmail returns extra details we don't need and that don't convert to JSON
            delete object.mail[0].message.transport;
            object.mail[0].status = {
                message: data.message
            };

            return object;
        }

        function send() {
            return sendMail(object, options);
        }

        tasks = [
                utils.handlePermissions(docName, 'send'),
                send,
                formatResponse
        ];

        return pipeline(tasks, options || {});
    },

    generateContent: function (options) {
        var defaults,
            data;

        defaults = {
            siteUrl: config.forceAdminSSL ? (config.urlSSL || config.url) : config.url
        };

        data = _.defaults(defaults, options.data);

        // read the proper email body template
        return readFile(path.join(templatesDir, options.template + '.html'), 'utf8').then(function (content) {
            var compiled,
                htmlContent,
                textContent;

            // insert user-specific data into the email
            compiled = _.template(content);
            htmlContent = compiled(data);

            // generate a plain-text version of the same email
            textContent = htmlToText.fromString(htmlContent);

            return {
                html: htmlContent,
                text: textContent
            };
        });
    }
};

module.exports = mail;
