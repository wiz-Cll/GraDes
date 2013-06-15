define(function( require, exports){
	var Util = require('./Util');
	var Seed = require('./Seed');
	var UI = require('./UI');

	var User = require('./User');
	var List = require('./List');
	var Todo = require('./Todo');
	var Note = require('./Note');

	window.onload = function(){

		var uaIE = navigator.userAgent.match(/MSIE\ [0-9].[0-9]/);
		if( uaIE ){
			var ieVersion = uaIE[0].slice( 5 );
			if( ieVersion < '8.0' ){
				// 提示浏览器版本过低
				return false;
			}
		}
		
		UI.init();
		// List.bind();
		List.getLists( Seed.token, true );

		Todo.bind();
		Note.bind();


		var tipCtn = Util.qs('#tip');
	};

	function sync(){
		if( navigator.onLine ){
			if( window.localStorage['changelist'] ){
				
			}
			else{
				Seed.showTip('同步完成： 没有需要同步的信息');
			}
		}
		else{
			Seed.showTip('同步失败：没有网络连接');
		}
	}
});