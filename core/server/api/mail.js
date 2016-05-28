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

function sendMail(object) {

    if (!(mailer instanceof IdoMail)) {
        mailer = new IdoMail();
    }

	return mailer.send(object).catch(function (err) {

        if (mailer.state.usingDirect) {
			console.log('using direct...');
        }

        return Promise.reject(new errors.EmailError(err.message));
    });
}


function generateContent(options) {


	var template = options ? options.template:'welcome';
	var data = options ? options.data:{siteUrl:'ido.com',ownerEmail:'84607842@qq.com'};

	// read the proper email body template
	return readFile(path.join(mailTemplatesDir, template + '.html'), 'utf8').then(function (content) {
		var compiled,
			htmlContent,
			textContent;

		// insert user-specific data into the email
		compiled = _.template(content);

		htmlContent = compiled(data);

		//console.log(htmlContent);

		// generate a plain-text version of the same email
		textContent = htmlToText.fromString(htmlContent);



		return {
			html: htmlContent,
			text: textContent
		};
	});
}

mail = {

    send: function (options) {

		var defaults = {to:'84607842@qq.com',subject:'欢迎来到爱都平台',template:'welcome'};
		var mail = options ? options.mail:defaults;

		generateContent(options).then(function(mailContent){

			console.log(mailContent);
			sendMail(_.assign(mail,mailContent));

		});

    }

};

module.exports = mail;
