var controllers = {};

controllers.mainController = ['$scope', '$location', function ($scope, $location) {	
	$scope.customers = [
		{name: 'John Smith', city: 'Phoenix'}, 
		{name: 'John Lennon', city: 'Batangas'}, 
		{name: 'Jane Doe', city: 'Pasay'}, 
		{name: 'John Doe', city: 'Annapolis'}
	];

	$scope.addCustomer = function () {
		$scope.customers.push(
			{
				name: $scope.newCustomer.name,
				city: $scope.newCustomer.city
			});
	}
}];

controllers.purchaseController = ['$scope', '$location', 'myService', function ($scope, $location, myService) {
	if ($location.protocol() != 'https') {
        window.location.href = $location.absUrl().replace('http', 'https');
	}
	var lang = $location.search().lang || myService.default_lang;
	$scope.product_currency = myService.c_currency;
	$scope.product_id = $location.search().id || $scope.product_id;

	$scope.product_id = ($scope.product_id === 'm-slavef') ? 'BSYR-001' :  $scope.product_id;
	$scope.product_id = ($scope.product_id === 'dvda') ? 'BSYR-002' :  $scope.product_id;
	$scope.product_id = ($scope.product_id === 'limitbreakera') ? 'BSYR-003' :  $scope.product_id;

	if ($scope.product_id === undefined) {
		$scope.product_id = 'BSYR-001'; //m-slavef
	}

	if ($scope.product_id === 'BSYR-002') {
		// dvda
		$scope.product_img = myService.c_product_img = 'https://www.busayari1.net/img/thumb/dvda.png'; 
		$scope.product_name = myService.c_product_name = '２０％オフ＆２４才美女を口説いた実録付】理性崩壊ブーストシステム～一晩で１３回イカせる究極の方法を映像と音声で～';
		$scope.product_amount_yen = 15700;
		$scope.product_desc = myService.c_product_desc = ['案内PDF : 2ページ', '動画(本編+特典動画)・音声 : 合計584分', 'ダウンロード版'];
	} else if ($scope.product_id === 'BSYR-003') {
		// limitbreakera
		$scope.product_img = myService.c_product_img = 'https://www.busayari1.net/img/thumb/limitbreakera.png';
		$scope.product_name = myService.c_product_name = '【２０％ＯＦＦ＆“恋愛ビジネスの答え”付き】性欲リミットブレイカー～女の性欲に火をつけるボディタッチ術～';
		$scope.product_amount_yen = 15000;
		$scope.product_desc = myService.c_product_desc = ['PDF : 13ページ', '動画 : 5時間03分', 'ダウンロード版'];
	} else {
		// m-slavef
		$scope.product_img = myService.c_product_img = 'https://www.busayari1.net/img/thumb/m-slavef.png';
		$scope.product_name = myService.c_product_name = '特別版：ドM美女完全覚醒術（２０％ＯＦＦ＆１８万円すぐに儲かる最後の方法付）';
		$scope.product_amount_yen = myService.c_pdf_amount = 18000;
		$scope.product_desc = myService.c_product_desc = ['案内PDF : 2ページ', '動画・音声 : 計8時間', 'ダウンロード版'];
	}

	$scope.product_amount_with_comma = $scope.product_amount_yen.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	myService.c_product_id = $scope.product_id;
	myService.c_pdf_amount_yen = $scope.product_amount_with_comma;
	$scope.product_amount = myService.c_pdf_amount = Math.ceil($scope.product_amount_yen / myService.usd); // convert to USD
	$scope.dlang = lang;
	$scope.lang = myService.lang;
	$scope.customer = myService.customer; // assign global customer to $scope

	// check if there was an error from previous checkout
	if (myService.err_message !== '') {
		jQuery('div.alert.alert-danger').html(myService.lang[myService.err_message][lang]).show();
	};
	
	var cur_year = new Date().getFullYear();
	$scope.years_range = [
		cur_year,
		cur_year + 1,
		cur_year + 2,
		cur_year + 3,
		cur_year + 4,
		cur_year + 5,
		cur_year + 6,
		cur_year + 7,
		cur_year + 8,
		cur_year + 9,
		cur_year + 10
	];
	$scope.updateName = function () {
		$scope.newCustomer.c_billingName = $scope.newCustomer.c_name;
	};
	$scope.upCase = function () {
		$scope.newCustomer.c_cardHolder = $scope.newCustomer.c_cardHolder.toUpperCase();
	}
	
	$scope.newCustomer = {
		c_name: myService.customer.c_name || '',
		c_email: myService.customer.c_email || '',
		c_email2: myService.customer.c_email2 || '',
		c_cardType: myService.customer.c_cardType || 'Visa',
		c_cardNumber: myService.customer.c_cardNumber || '',
		c_cardHolder: myService.customer.c_cardHolder || '',
		c_cardCvc: myService.customer.c_cardCvc || '',
		c_cardMonth: myService.customer.c_cardMonth || '01',
		c_cardYear: myService.customer.c_cardYear || cur_year,
		c_billingName: myService.customer.c_billingName || '',
		c_billingPostal: myService.customer.c_billingPostal || '',
		c_billingState: myService.customer.c_billingState || '',
		c_billingCity: myService.customer.c_billingCity || '',
		c_billingAddress1: myService.customer.c_billingAddress1 || '',
		c_billingAddress2: myService.customer.c_billingAddress2 || '',
		c_billingTel: myService.customer.c_billingTel || '09051702001',
		c_billingCountry: myService.customer.c_billingCountry || 'JP',
		c_pdf_amount: myService.c_pdf_amount,
		c_currency: myService.c_currency,
		c_product_name: myService.c_product_name
	};

	$scope.addCustomer = function () {
		var redirect = true;
		var there_is_error = false;
		var email = 'email';

		angular.forEach($scope.newCustomer, function(value, key) {

			// assign to the global service so values get retained when changing page
			// do not include c_email2 field
			if (key !== 'c_email2') {
				myService.customer[key] = value;
			}
			
			// all fields are required except these
			//if (key !== 'c_billingAddress2' && key !== 'c_billingTel') {
				if (value === '') {
					if (key !== 'c_billingAddress2' && key !== 'c_billingState') {
						there_is_error = true;
					}
				} else {
					// check if valid email
					if (key === 'c_email') {
						// email must be valid
						if (/[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}/.exec(value) === null) {
							there_is_error = true;
						} else {
							email = value;
						}
					}
					if (key === 'c_email2') {
						if (/[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}/.exec(value) === null) {
							there_is_error = true;
						} else if (email !== value) { // if c_email and c_email2 are different
							there_is_error = true;
						}
					}

					if (key === 'c_cardNumber' || key === 'c_cardCvc') {
						// look for at least 1 non-numeric character
						// to fire an error
						if (/[^0-9]+/.exec(value) !== null) {
							there_is_error = true
						}
					}
					jQuery('label[for=' + key + ']').parent().removeClass('has-error');
					jQuery('span#' + key).html('');
				}

				if (there_is_error) {
					jQuery('label[for=' + key + ']').parent().addClass('has-error');
					jQuery('span#' + key).html(myService.lang[key][lang]);
					jQuery('div.alert.alert-danger').html(myService.lang.input_correct_info[lang]).show();
					redirect = false;
					there_is_error = false;
					window.scrollTo(0, 200); // scroll to top of page
				}
			//} else {
			//	if (value === '') {
			//		// just for display purposes whether there's comma or not
			//		if (key === 'c_billingAddress2') {
			//			myService.comma = ' ';
			//		};
			//	}
			//}
		});
		if (redirect) { 
			myService.is_step = 2;
			$location.path('/confirm'); 
		}
	}
}];

controllers.confirmController = ['$scope', '$location', '$http', 'myService', function ($scope, $location, $http, myService) {
	$scope.dlang = $location.search().lang || myService.default_lang;
	$scope.lang = myService.lang;
	$scope.customer = myService.customer; // assign global customer to $scope
	$scope.comma = myService.comma;
	$scope.product_name = myService.c_product_name;
	$scope.product_desc = myService.c_product_desc;
	$scope.product_amount_with_comma = myService.c_pdf_amount_yen;
	$scope.product_currency = myService.c_currency;
	$scope.product_amount = myService.c_pdf_amount;

	if (myService.is_step !== 2) {
		$location.path('/purchase');
	}

	$scope.checkout = function () {
		myService.is_step = 3;

		$.post(myService.BASEURL, $scope.customer, function(data){
            if(data.status === 'success') {
            	myService.c_id = data.c_id;
            	myService.c_token = data.c_token;
            	myService.c_download_count = data.c_downloadCount;
            	myService.c_download_expire = data.c_downloadExpire;
            	myService.tx_id = data.tx_id;
            	$scope.$apply(function() {
            		$location.path('/success'); // does not work without $scope.$apply()
            	})
         	} else {
         		// there was an error
         		myService.err_message = data.message;
         		$scope.$apply(function() {
            		$location.path('/purchase');
            	})
         	};
    	});
	}
}];

controllers.successController = ['$scope', '$location', 'myService', function ($scope, $location, myService) {
	var t = new Date( myService.c_download_expire * 1000 );
	$scope.download_expire = t.toDateString() + ', ' + t.getHours() + ':' + t.getMinutes();
	$scope.download_count = myService.c_download_count;
	$scope.customer = myService.customer; // assign global customer to $scope
	$scope.c_product_name = myService.c_product_name;
	$scope.c_pdf_amount_yen = myService.c_pdf_amount_yen;
	$scope.c_product_id = myService.c_product_id;
	$scope.tx_id = myService.tx_id;
	$scope.lang = myService.lang;
	$scope.dlang = $location.search().lang || myService.default_lang;

	if (myService.is_step !== 3) {
		$location.path('/purchase');
	}

	$scope.download = function () {
		$scope.download_count = myService.c_download_count - 1;
		var params = {
			c_id: myService.c_id,
			c_token: myService.c_token,
			c_downloadCount: myService.c_download_count - 1,
			action: 'set'
		};

		$.get(myService.BASEURL + "download", params, function(data){
			myService.c_download_count = data.c_downloadCount;
			if (params.action === 'set') {
            	$scope.download_count = data.c_downloadCount - 1;
            } else {
            	$scope.download_count = data.c_downloadCount;
            }

            // only 3 times can download
            if (data.c_downloadCount === '0') {
            	jQuery('button').hide(0);
            }

            // open the download file page
            var uri = '?c_id=' + params.c_id + '&c_token=' + params.c_token + '&action=get'; 
            window.location.href = myService.BASEURL  + "download" + uri;
    	});
	}


}];

mainApp.controller(controllers);