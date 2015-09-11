var mainApp = angular.module('mainApp', ['ngRoute']);
mainApp.config(function ($routeProvider) {
	$routeProvider
		.when('', {
			controller : 'mainController',
			templateUrl: './views/index.html'
		})
		.when('/', {
			controller : 'mainController',
			templateUrl: './views/index.html'
		})
		.when('/index.html', {
			controller : 'mainController',
			templateUrl: './views/index.html'
		})
		.when('/purchase', {
			controller : 'purchaseController',
			templateUrl: './views/purchase.html'
		})
		.when('/confirm', {
			controller : 'confirmController',
			templateUrl: './views/confirm.html'
		})
		.when('/success', {
			controller : 'successController',
			templateUrl: './views/success.html'
		})
		.otherwise({ redirectTo : '/' });
});

mainApp.service("myService", function(){
    this.customer = {};
    this.usd = 119.50; // jpy to usd
    this.err_message = '';
    this.comma = ', ';
    this.is_step = 1;
    this.c_id = 0;
    this.c_token = '';
    this.c_download_count = 3;
    this.c_pdf_amount = 0;
    this.c_pdf_amount_yen = 0;
    this.c_product_name = '';
    this.c_product_id = '';
    this.c_product_img = '';
    this.c_product_desc = '';
    this.tx_id = '';
    this.c_currency = 'USD'; // JPY
    this.c_download_expire = Math.floor((new Date).getTime()/1000); // current date
    this.file_to_download = 'file_to_download.pdf';
    this.BASEURL = 'https://busayari1.net:3000/';
    //this.BASEURL = 'http://localhost:3000/';
    this.default_lang = 'jp';
    this.lang = {
    	c_name: {
    		en: 'Input your name',
    		jp: 'ご購入者のお名前を入力してください。'
    	},
    	c_email: {
    		en: 'Input mail address',
    		jp: 'メールアドレスを入力してください。'
    	},
    	c_email2: {
    		en: 'Mail address not match',
    		jp: '入力されたメールアドレスが一致しません。'
    	},
    	c_cardNumber: {
    		en: 'Input card number. Must be numeric',
    		jp: 'カード番号をハイフンなしで入力してください。'
    	},
    	c_cardCvc: {
    		en: 'Input card CVC. Must be numeric',
    		jp: 'カード裏面に記載のセキュリティ(CVC)番号を入力してください。'
    	},
    	c_cardHolder: {
    		en: 'Input card holder name',
    		jp: 'カード名義人名を入力してください。'
    	},
    	c_cardMonth: {
    		en: 'Input expire month',
    		jp: 'カード有効期限を選択してください。'
    	},
    	c_cardYear: {
    		en: 'Input expire year',
    		jp: 'カード有効期限を選択してください。'
    	},
    	c_billingName: {
    		en: 'Input billing name',
    		jp: 'ご請求先のお名前を入力してください。'
    	},
    	c_billingPostal: {
    		en: 'Input postal code',
    		jp: 'ご請求先の郵便番号を入力してください。'
    	},
    	c_billingState: {
    		en: 'Select state',
    		jp: 'ご請求先の都道府県名を選択してください。'
    	},
    	c_billingCity: {
	    	en: 'Select city',
	    	jp: 'Select city'
    	},
        c_billingCountry: {
            en: 'Country',
            jp: 'ご請求先の国名を選択してください。'
        },
    	c_billingAddress1: {
    		en: 'Input apartment or building',
    		jp: 'ご請求先のアパート番号やビル名を入力してください。'
    	},
        c_billingAddress2: {
            en: 'Input billing address',
            jp: 'ご請求先の住所を入力してください。'
        },
        c_billingTel: {
            en: 'Input billing telephone',
            jp: '電話番号を入力してください。'
        },
    	input_correct_info: {
    		en: 'Please input correct information',
    		jp: '入力エラーがあります。入力内容にお間違いがないかご確認ください。'
    	},
    	purchase_id: {
    		en: 'Purchase ID',
    		jp: 'ご購入番号'
    	},
    	your_name: {
    		en: 'Your Name',
    		jp: 'ご購入者名'
    	},
    	payment_type: {
    		en: 'Payment Type',
    		jp: 'お支払い方法'
    	},
    	email: {
    		en: 'Email',
    		jp: 'メールアドレス'
    	},
    	reinput_email: {
    		en: 'Re-input Email',
    		jp: 'メールアドレス(確認用)'
    	},
    	card_type: {
    		en: 'Card Type',
    		jp: 'クレジットカード'
    	},
    	card_number: {
    		en: 'Card Number',
    		jp: 'カード番号'
    	},
    	cvc_number: {
    		en: 'CVC Number',
    		jp: 'セキュリティーコード'
    	},
    	holder_name: {
    		en: 'Card Holder Name',
    		jp: 'カード名義人'
    	},
    	expire_date: {
    		en: 'Expire Date',
    		jp: '有効期限'
    	},
    	postal_code: {
    		en: 'Postal Code',
    		jp: '郵便番号'
    	},
    	city: {
	    	en: 'City',
	    	jp: '都道府県'
    	},
    	address: {
    		en: 'Address',
    		jp: '住所1'
    	},
    	apartment: {
    		en: 'Apartment or Building',
    		jp: '住所2'
    	},
    	phone: {
    		en: 'Phone Number',
    		jp: '電話番号'
    	},
    	personal_info: {
    		en: 'Personal Information',
    		jp: 'お客様情報'
    	},
    	credit_card_info: {
    		en: 'Credit Card Information',
    		jp: 'お支払い方法'
    	},
    	billing_info: {
    		en: 'Billing Information',
    		jp: 'クレジットカード請求先'
    	},
        db_write_err: {
            en: 'There was an error writing to the database. Try again later.',
            jp: 'データベースの書き込み時にエラーが発生しました。お手数ですが再度お試しください。'
        },
        transaction_failed: {
            en: 'Transaction Failed.',
            jp: 'Transaction Failed'
        },
        purchase_product: {
            en: 'Purchase Product',
            jp: 'ご注文の内容'
        },
        required: {
            en: 'Required',
            jp: '必須'
        },
        confirm_button_text: {
            en: 'Confirm',
            jp: '確認画面へ進む'
        },
        country: {
            en: 'Country',
            jp: '国'
        },
        total_price: {
            en: 'Total Price',
            jp: '合計金額'
        },
        credit_card: {
            en: 'Credit Card',
            jp: 'クレジットカード'
        },
        purchase: {
            en: 'Purchase',
            jp: '購入手続きを完了する'
        },
        go_back: {
            en: 'Back',
            jp: '戻る'
        }
    }
});