// # Mail API
// API for sending Mail
var _             = require('lodash').runInContext(),
    Promise       = require('bluebird'),
    pipeline      = require('../utils/pipeline'),
    config        = require('../config'),
    errors        = require('../errors'),
    GhostMail     = require('../mail'),
    utils         = require('./utils'),
    path          = require('path'),
    fs            = require('fs'),
    mailTemplatesDir  = path.resolve(__dirname, '..', 'mail', 'templates'),
    htmlToText    = require('html-to-text'),
    readFile      = Promise.promisify(fs.readFile),
    mode          = process.env.NODE_ENV,
    testing       = mode !== 'production' && mode !== 'development',
    mailer,
    mail;



/**
 * Send mail helper
 */

function sendMail(object) {
    if (!(mailer instanceof GhostMail) || testing) {
        mailer = new GhostMail();
    }

    return mailer.send(object.mail[0].message).catch(function (err) {
        if (mailer.state.usingDirect) {

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

        data = _.defaults(defaults, options.data);

        // read the proper email body template
        return readFile(path.join(mailTemplatesDir, options.template + '.html'), 'utf8').then(function (content) {
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
