define( function( require, exports, module){
	var Util = require('./Util');
	var UI = require('./UI');

	var Conf = require('./Config');
	var Valid = require('./Valid');

	function getTodos( token, listid ){
		var param = {
			action: 'get',
			list_id: listid,
			token: token
		}
		Util.ajaxPost( Conf.eventUrl, param , function( data ){
			cbGetTodos( data, listid );
		});

		function cbGetTodos( data, listid ){
			var localErrMap = {};
			if( data.error_code == 0){
				var domNode = Util.qs('.todos[data-listid="'+ listid +'"]');
				if( !domNode ){
					domNode = document.createElement('section');
					domNode.dataset.listid = listid;
					Util.qs('section').appendChild( domNode );
				}
				UI.renderAll( data.events, domNode, UI.renderSingalTodo  );
			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				showTip( tip );
			}
			return false;
		}
	}

	function createTodo( token, list_id, todo_str){
		var param = {
			action: 'new',
			token: token,
			list_id: list_id,
			event_content: todo_str
		};
		Util.ajaxPost( Conf.eventUrl, param, function( data, status){
			console.log( data );
		});
	}

	function bindHandler(){

		bindCreate();

		function bindCreate(){
			// keydown
			Util.Event.addHandler( Util.qs('#todo-input'), 'keydown', function(e){
				// 键盘事件  可能存在兼容新性问题
				// 同时  避免搜狗输入法中文时按enter输入英文可能发生的错误
				// console.log( e );
				var keyCode = Util.Event.getCharCode( e );
				if( keyCode === 13){
					console.log( e.target.value );
					todoContent = e.target.value;
					var listId = Util.qs('.list.active').dataset.listid;
					createTodo( Util.token, listId, todoContent);
				}
			});
		}
	}

	exports.get = getTodos;
	exports.bind = bindHandler;
	exports.create = createTodo;

})