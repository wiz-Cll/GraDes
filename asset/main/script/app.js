define(function( require, exports){
	var Util = require('./Util');
	var Seed = require('./Seed');
	var User = require('./User');
	var List = require('./List');
	var Todo = require('./Todo');
	var UI = require('./UI');

	window.onload = function(){
		UI.init();
		// List.bind();
		List.getLists( Seed.token, true );

		Todo.bind();


		var tipCtn = Util.qs('#tip');
		Util.Event.addHandler( tipCtn, 'webkitTransitionEnd', function(){
			// console.log( 'tip动画结束' );
		} );
		Util.Event.addHandler( tipCtn, 'transitionEnd', function(){
			// console.log( 'tip动画结束' );
			Util.Event.removeHandler( tipCtn,'webkitTransitionEnd');
		} );
		
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