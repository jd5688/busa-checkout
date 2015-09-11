/*
mysql = require('mysql');
var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'busayari'
	});
*/
var dl = function(conn) {
	var obj = {
		conn : conn,
		verify: function(param, callback) {
			var today = Math.floor((new Date).getTime()/1000);
			var sql = "SELECT * FROM customers WHERE c_id = " + param.c_id;
			var that = this;
			this.conn.query(sql, function(err, result) {
				if (typeof result[0] === 'undefined') {
					callback( { status: 'error', message: 'no record found', c_downloadCount: 0 } );
				} else {
					var c_download_expire = result[0].c_downloadExpire;
					var c_download_count = result[0].c_downloadCount;
					var c_token = result[0].c_token;
					var c_email = result[0].c_email;
					var c_data = result[0];

					if (today > c_download_expire ) {
						// already expired
						callback( { status: 'error', message: 'expired', c_downloadCount: 0 } );
					} else if (c_download_count === 0) {
						// no more downloads
						callback( { status: 'error', message: 'no more downloads', c_downloadCount: 0 } );
					} else if (c_token !== param.c_token) {
						// token invalid
						callback( { status: 'error', message: 'token invalid', c_downloadCount: 0 } );
					} else {
						if (param.action === 'get') {
							c_download_count -= 1;
							sql = "UPDATE customers SET c_downloadCount = " + c_download_count + " WHERE c_id = " + param.c_id;
							that.conn.query(sql, function(err, result) {
								callback( { status: 'success', message: 'successful', c_downloadCount: c_download_count, data: c_data }, c_email );
							});
						} else if (param.action === 'set') {
							callback( { status: 'success', message: 'successful', c_downloadCount: param.c_downloadCount, data: c_data } );
						} else {
							callback( { status: 'error', message: 'invalid action', c_downloadCount: 0 } );
						}
					}
				};
			});
		}
	};

	return obj;
}

module.exports = dl;
/*
var dl1 = dl(connection);
var param = {c_id: 1, c_token: '7f4fb9c2f1a8a6c0f2183aa1a4ba9d60', c_downloadCount: 3, action: 'set'};
dl1.verify(param, function(data){
	console.log(data);
})
*/
