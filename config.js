

var path = require('path'),
    config;

config = {
    // ### Production

    production:    {
        url: 'http://ido-qimuyunduan.rhcloud.com',
        mail: {
			host: "smtp.126.com",
			secureConnection: true,
			// use SSL
			port: 25,
			options: {
                auth: {
                    user: 'idoadmin@126.com',
                    pass: '10141010122'
                }
            },
			fromAddress:'idoadmin@126.com'
        },
        database: {
            client: 'mysql',
            connection: {
				host:'http://ido-qimuyunduan.rhcloud.com',
				user:'adminbelIW8b',
				password:'ules4q5Jn1fl',
				database:'ido',
				charset:'utf8'
            },
            debug: false
        },

        server: {
            host: 'http://ido-qimuyunduan.rhcloud.com',
            port: '2368'
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        // Change this to your App published URL.
        url: 'http://localhost:2368',

        // Example mail config


        mail: {
			host: "smtp.126.com",
			secureConnection: true,
			// use SSL
			port: 25,
            options: {
                auth: {
                    user: 'idoadmin@126.com',
                    pass: '10141010122'
                }
            },
			fromAddress:'idoadmin@126.com'
        },

        // #### Database
        // App supports MySQL
        database: {
            client: 'mysql',
			connection: {
				host:'127.0.0.1',
				port     : '3306',
				user:'root',
				password:'root',
				database:'dwz4j',
				charset:'utf8'
			},
            debug: false
        },
        // #### Server
        // Can be host & port (default), or socket
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '2368'
        },
        // #### Paths
        // Specify where your content directory lives
        paths: {
            contentPath: path.join(__dirname, '/content/')
        }
    }

};

module.exports = config;
