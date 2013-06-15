define( function( require, exports, module){
	var Util = require('./Util');
	var UI = require('./UI');
	var Seed = require('./Seed');
	var Conf = require('./Config');
	var Valid = require('./Valid');

	function getNote( token, todoId, blNetFirst, blNetMust ){
		var param = {
			action: 'gettitles',
			event_id: todoId,
			token: token
		};

		Seed.allMityOp( getNoteFromRemote, getNoteFromLocal, param, blNetFirst, blNetMust);


		function getNoteFromRemote( param ){
			Seed.ajaxPost( Config.noteUrl, param, function( data ){
				if( data.error_code === 0 ){
					param.note = data;
					cbGetNote( param );
				}
				else{
					var errMsg = Util.errMap[ data.error_code ] || '未知错误';
					Seed.showTip( errMsg );
				}
			});
		}
		function getNoteFromLocal( param ){}
		function cbGetNote( param ){
			var todo = Util.qs('.todo[data-todoid="' + param.event_id + '"]');
			var todoDetail = todo.children[2].innerHTML;
			console.log( param.data );
		}

		// function preRender

	}

	function bind(){
		bindClose();
		function bindClose(){
			var noteCtn = Util.qs('#notectn');
			Util.Event.addHandler( noteCtn, 'click', function( e ){
				var target = e.target;

				switch( target.className ){
					case 'close':
						Util.removeClass(noteCtn,'show');
						break;
					case 'show':
						Util.removeClass(noteCtn,'show');
						break;
				}
			});

			// Util.Event.addHandler( noteCtn, 'keyup', function( e ){
			// 	var keyCode = Util.Event.getCharCode( e );
			// 	if( keyCode === 13){
			// 		Util.removeClass(noteCtn,'show');
			// 	}
			// });
		}
	}


	exports.get = getNote;
	exports.bind = bind;
} );