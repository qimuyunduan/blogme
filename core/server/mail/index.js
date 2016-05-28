
var _          = require('lodash'),
    Promise    = require('bluebird'),
    nodemailer = require('nodemailer'),
    validator  = require('validator'),
	mode       = process.env.NODE_ENV||'production',
    config     = require('../config');


function Mailer() {

    var transport = "SMTP";
        options   = config._config[mode].mail.config;

    this.transport = nodemailer.createTransport(transport, options);

}

Mailer.prototype.from = function () {

    var from = config._config[mode].mail && (config._config[mode].mail.from || config._config[mode].mail.fromAddress);

    // If we don't have a from address at all
    if (!from) {

        from = '' + this.getDomain();
    }

    // If we do have a from address, and it's just an email
    if (validator.isEmail(from)) {
		return from;
    }


};


Mailer.prototype.getDomain = function () {
    var domain = config._config[mode].url.match(new RegExp('^https?://([^/:?#]+)(?:[/:?#]|$)', 'i'));
    return domain[1];
};


Mailer.prototype.send = function (message,res) {

    var self = this,
        to;

    message  = _.clone(message) || {};
    to = message.to || false;

    if (!(message && message.subject && message.html && message.to)) {
        return Promise.reject(new Error('errors.mail.incompleteMessageData.error'));
    }

    message = _.extend(message, {
        from: self.from(),
        to: to,
        encoding: 'base64'
    });

    return new Promise(function (resolve, reject) {


		//console.log(message);
        self.transport.sendMail(message, function (error, response) {


            if (error) {

				console.log('error occured....');
				// do other things...
                return reject(new Error(error));
            }

			res.end();

            if (self.transport.transportType !== 'DIRECT') {
                return resolve(response);
            }

            response.statusHandler.once('failed', function (data) {
                var reason = 'errors.mail.failedSendingEmail.error';

                if (data.error && data.error.errno === 'ENOTFOUND') {
                    reason += 'errors.mail.noMailServerAtAddress.error';
                }
                reason += '.';
                return reject(new Error(reason));
            });

            response.statusHandler.once('requeue', function (data) {
                var errorMessage = 'errors.mail.messageNotSent.error';

                if (data.error && data.error.message) {
                    errorMessage += 'errors.general.moreInfo';
                }

                return reject(new Error(errorMessage));
            });

            response.statusHandler.once('sent', function () {
                return resolve('notices.mail.messageSent');
            });
			
        });
    });
};

module.exports = Mailer;
