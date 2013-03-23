define(function( require, exports, module ){
	var serviceUrl = 'http://chenllos.com/api';

	//用户操作
	var signUpUrl = serviceUrl + '?action=signup';
	var signInUrl = serviceUrl + '?action=signin';

	exports.signUpUrl = signUpUrl;
})

