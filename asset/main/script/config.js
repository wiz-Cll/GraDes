define(function( require, exports, module ){
	// var serviceUrl = 'http://beta.unuw.net:801/api/api/';
	var serviceUrl = 'http://sdust.unuw.net/api/api/';

	//用户操作
	var userUrl = serviceUrl + 'User.php';
	var listUrl = serviceUrl + 'List.php';
	var eventUrl = serviceUrl + 'Event.php';
	var noteUrl = serviceUrl + 'Note.php';
	// var signInUrl = serviceUrl + 'user.php?action=signin';

	exports.userUrl = userUrl;
	exports.listUrl = listUrl;
	exports.eventUrl = eventUrl;
});