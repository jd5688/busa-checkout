/*
mysql = require('mysql');
var connection = mysql.createConnection({
		host     : '127.0.0.1',
		user     : 'busayari_busayar',
		password : 'hehishim#22',
		database : 'busayari_busayari1'
	});
*/
var crypto = require('crypto');
var soap = require('soap');
var cust = function(conn) {
	var obj = {
		conn : conn,
		addCustomer: function (customer, ip, callback) {
			var sql = '';
			var call_params = '';
			var that = this;
			customer.c_timeRegistered = Math.floor((new Date).getTime()/1000);
			customer.c_downloadExpire = customer.c_timeRegistered + (60*60*24*3); // 72 hours
			customer.c_downloadCount = 0;
			customer.c_token = crypto.randomBytes(16).toString('hex');
			customer.c_ip_address = ip;
			this._checkCustomerExists(customer, function(c_id) {
				if (!c_id) {
					sql = "INSERT INTO customers SET ?";
					that.conn.query(sql, customer, function(err, result) {
						if (err) {
							call_params = {
								status : 'error',
								message: 'db_write_err'
							};
						} else {
							call_params = {
								status : 'success', 
								message: 'write to db successful',
								c_id: result.insertId, 
								c_token: customer.c_token, 
								c_downloadCount: customer.c_downloadCount,
								c_downloadExpire: customer.c_downloadExpire
							};
						}
						callback(call_params);
					});
				} else {
					// if customer buys again
					sql = "UPDATE customers SET ? WHERE c_id = " + c_id;
					that.conn.query(sql, customer);
					call_params = {
							status : 'success', 
							message: 'write to db successful',
							c_id: c_id, 
							c_token: customer.c_token, 
							c_downloadCount: customer.c_downloadCount,
							c_downloadExpire: customer.c_downloadExpire
						};
					callback(call_params);
				};
			});
		},
		_checkCustomerExists: function (customer, callback) {
			callback(false); // return everything as false
			/*
			var sql = "SELECT c_id FROM customers WHERE c_email = ?";
			this.conn.query(sql, customer.c_email, function (err, result) {
				if (typeof result[0] === 'undefined') {
					callback(false);
				} else {
					callback(result[0].c_id);
				}
			});
			*/
		},
		checkout: function (cust, ip, c_id, callback) {
			var that = this;
			var url = 'http://dev.ucpcpay.com/wsvc/cardtransactions.asmx?wsdl';
			var tx_id = c_id.toString() + Math.floor((new Date).getTime()/1000).toString();
			//var tx_id = Math.floor((new Date).getTime()).toString();

			var merchant_id = 'BARR1412151938';
			var account_id = 'BARRPKQKUSD0171';
			var merchant_key = 'af43c9d507ea6bd8bf3579be05912cce';
			var username = 'barronstest';
			var password = '8x5t2lg3';
			var bill_address = cust.c_billingAddress1;
			if (cust.c_billingAddress2 !== "") {
				bill_address += ", " + cust.c_billingAddress2;
			}
			var concat_string = merchant_id
								+ account_id
								+ tx_id
								+ parseInt(cust.c_pdf_amount).toFixed(2).toString()
								+ cust.c_currency.toString()
								+ cust.c_cardType.toUpperCase()
								+ cust.c_cardHolder
								+ cust.c_cardNumber.toString()
								+ cust.c_cardCvc.toString()
								+ cust.c_cardMonth.toString()
								+ cust.c_cardYear.toString()
								+ merchant_key;

			var hash_string = crypto.createHash('sha512').update(concat_string).digest('hex').toUpperCase();

			var args = {
				Identifications: {
					MerchantId: merchant_id,
					AccountId: account_id
				},
				Credential: {
					AccountUsername: username,
					AccountPassword: password
				},
				Payment: {
					TransactionID: tx_id,
					Amount: parseInt(cust.c_pdf_amount).toFixed(2),
					Currency: cust.c_currency
				},
				Account: {
					Name: cust.c_cardHolder,
					Number: cust.c_cardNumber,
					Brand: cust.c_cardType.toUpperCase(),
					ExpiryYear: cust.c_cardYear,
					ExpiryMonth: cust.c_cardMonth,
					Verification: cust.c_cardCvc
				},
				Customer: {
					FirstName: cust.c_cardHolder.trim().split(" ")[0],
					LastName: cust.c_cardHolder.trim().split(" ")[1],
					Street: bill_address,
					Zip: cust.c_billingPostal,
					City: cust.c_billingCity,
					State: cust.c_billingState,
					Country: cust.c_billingCountry,
					Phone: cust.c_billingTel,
					EmailAddress: cust.c_email,
					IPAddress: cust.c_ip_address
				},
				Authentication: {
					HashString: hash_string
				},
				CallBackAddress: {
					RedirectURL: 'http://www.busayari1.net',
					CallbackURL: 'http://www.busayari1.net'
				}
			};

			soap.createClient(url, function(err, client) {
				var call_params = {};
				client.CAPTURE(args, function(err, result) {
					//callback({ arguments: args, result: result });
					//return;
					sql = "UPDATE customers SET c_purchaseStatus = " + result.CAPTUREResult.Details.ResponseCode + ", c_receipt = " + tx_id + ", c_downloadCount = 3 WHERE c_id = " + c_id;
					that.conn.query(sql);
					if (result.CAPTUREResult.Details.ResponseCode === "0") {
						call_params = {
							status : 'success', 
							message: result.CAPTUREResult.Details.Description,
							tx_id: tx_id,
							c_id: c_id, 
							c_token: cust.c_token, 
							c_downloadCount: 3,
							c_downloadExpire: cust.c_downloadExpire
						};
					} else {
						call_params = {
							status : 'error', 
							message: 'transaction_failed',
							tx_id: '',
							c_id: c_id, 
							c_token: cust.c_token, 
							c_downloadCount: 0,
							c_downloadExpire: cust.c_downloadExpire
						};
					}
					callback(call_params);
				});
			})
		} // checkout()
	};

	return obj;
}

module.exports = cust;
/*
var cust1 = cust(connection);
cust1.addCustomer({c_email: 'dem@gmail.com', c_cardType: 'Visa', c_cardCvc: 321});
*/
