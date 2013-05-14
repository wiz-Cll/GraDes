define( function( require, exports, module){
	var Util = require('./Util');
	var UI = require('./UI');

	var Conf = require('./Config');
	var Valid = require('./Valid');

	function getEvents( token, listid ){
		var param = {
			action: 'get',
			list_id: listid,
			token: token
		}
		Util.ajaxPost( Conf.eventUrl, param , function( data ){
			cbGetEvents( data, listid );
		});

		function cbGetEvents( data, listid ){
			var localErrMap = {};
			if( data.error_code == 0){
				// UI.renderAllEvents( data.events, Util.qs('.event[data-listid="'+ listid +'"]'));
			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				showTip( tip );
			}
			return false;
		}
	}

	exports.get = getEvents;

})