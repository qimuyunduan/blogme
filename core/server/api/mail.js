// # Mail API
// API for sending Mail
var _             = require('lodash'),
    Promise       = require('bluebird'),
    config        = require('../config'),
    errors        = require('../errors'),
    IdoMail       = require('../mail'),
    utils         = require('./utils'),
    path          = require('path'),
    fs            = require('fs'),
    mailTemplatesDir  = path.resolve(__dirname, '..', 'mail', 'templates'),
    htmlToText    = require('html-to-text'),
    readFile      = Promise.promisify(fs.readFile),
    mailer,
    mail;



/**
 * Send mail helper
 */

function sendMail(object,res) {

    if (!(mailer instanceof IdoMail)) {
        mailer = new IdoMail();
    }

	return mailer.send(object,res).catch(function (err) {

        return Promise.reject(new errors.EmailError(err.message));
    });
}


function generateContent(options) {

	// read the proper email body template
	return readFile(path.join(mailTemplatesDir, options.template + '.html'), 'utf8').then(function (content) {



		var htmlContent,
			textContent;

		// set handlerbars model
		_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g,
			evaluate: /\{\%(.+?)\%\}/g
		};

		// insert user-specific data into the email
		htmlContent = _.template(content)(options.data);

		// generate a plain-text version of the same email
		textContent = htmlToText.fromString(htmlContent);



		return {
			html: htmlContent,
			text: textContent
		};
	});
}

mail = {

    send: function (options,res) {

		var mail = {to:'84607842@qq.com',subject:'欢迎来到爱都平台',template:'welcome'};
		var data = {data:{"siteUrl":'ido.com',"ownerEmail":'84607842@qq.com'}};
		if(_.isEmpty(options)){
			options = _.assign(mail,data);
		}

		generateContent(options).then(function(mailContent){
			sendMail(_.assign(options,mailContent),res);
		});

    }

};

module.exports = mail;
