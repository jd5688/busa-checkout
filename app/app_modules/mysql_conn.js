var conn = function () {
	return obj = {
		mysql : {},
		connect: function(mysql) {
			this.mysql = mysql;
			return this.init(mysql);
		},
		init: function() {
			return this.mysql.createConnection({
				host     : 'localhost',
	  			user     : 'root',
	  			password : ''
			});
		},
		connect: function() {
			mysql = this.mysql;
			this.connect.connect(); 
		},
		end: function () {
			mysql = this.mysql;
			this.connect.end();
		}
	};
};

exports = conn();