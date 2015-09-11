var	express = require('express'),
	http = require('http'),
	https = require('https'),
	mysql = require('mysql'),
	mime = require('mime'),
	url = require('url'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto'),
	Customer = require('./app_modules/customer'),
	Download = require('./app_modules/download'),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require("body-parser"),
	cors = require('cors'),
	app = express(),
	port = 3000;
var connection = mysql.createConnection({
		host     : '127.0.0.1',
		user     : 'busayari_busayar',
		password : 'hehishim#22',
		database : 'busayari_busayari1'
		//host     : 'localhost',
		//user     : 'root',
		//password : '',
		//database : 'busayari'
	});

var options = {
  key: fs.readFileSync(__dirname + '/cert/Privatekey.txt'),
  cert: fs.readFileSync(__dirname + '/cert/CRT.crt')
};
var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(app);
//httpServer.listen(port);
httpsServer.listen(port);

var pdf_file = 'image001.jpg';
var customer = Customer(connection);
var download = Download(connection);
var transporter = nodemailer.createTransport('SMTP', {
    host: 'localhost',
    port: 25,
    auth: {
        user: 'noreply@busayari1.net',
        pass: 'hehishim#22'
    }
});

app.use(cors())
   .use(bodyParser.urlencoded({ extended: false }))
   .post('/', function(req, res){
	    customer.addCustomer(req.body, req.ip, function(resp) {
	    	res.writeHead(200, {'Content-Type': 'application/json'});
	    	if (resp.status === 'error') {
	    		// there was an error writing to the database
	    		res.end(JSON.stringify(resp));
	    	} else {
	    		customer.checkout(req.body, req.ip, resp.c_id, function(data) {
	    			if (data.status === 'success') {
	    				
						transporter.sendMail({
						    from: 'noreply@busayari1.net',
						    to: req.body.c_email,
						    subject: 'transaction successful',
						    text: 'hello world! Transaction id: ' + data.tx_id 
						});
	    			}
	    			res.end(JSON.stringify(data));
		   		});
	    	}
	    });
	})
   .get('/download', function(req, res) {
		var file = __dirname + '/pdf_file/' + pdf_file;

		var filename = path.basename(file);
		var mimetype = mime.lookup(file);

		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		download.verify(query, function(data, email) {
			if (data.status === 'error') {
				res.writeHead(200, {'Content-Type': 'application/json'});
	    		res.end(JSON.stringify( data ));
			} else {
				// SET on sets display on the browser side
				if (query.action === 'set') {
					res.writeHead(200, {'Content-Type': 'application/json'});
			    	res.end(JSON.stringify( data ));
				}

				// GET is the actual download page being presented
				if (query.action === 'get') {
					var customer = data.data.c_name;
					transporter.sendMail({
					    from: 'noreply@busayari1.net',
					    to: email,
					    subject: 'hello',
					    text: 'hello world!'
					});
					// download file
					res.setHeader('Content-disposition', 'attachment; filename=' + filename);
					res.setHeader('Content-type', mimetype);

					var filestream = fs.createReadStream(file);
					filestream.pipe(res);
				}
			}
		});				
   })
   .get('/test', function(req, res) {
   		/*
   		var sql = "SELECT * FROM customers WHERE c_id = 2";
   		connection.query(sql, function (err, result) {
	   		var cust = result[0];
	   		customer.checkout(cust, req.ip, cust.c_id, function(data) {
					res.writeHead(200, {'Content-Type': 'application/json'});
			    	res.end(JSON.stringify( data ));
	   		});	
		});
		*/
		res.end('hey there');
    });
   //.listen(port);

console.log('Listening at http://localhost:' + port)
