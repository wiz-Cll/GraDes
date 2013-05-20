define( function( require, exports, module){
	var Util = require('./Util');
	var UI = require('./UI');

	var Conf = require('./Config');
	var Valid = require('./Valid');

	function getTodos( token, listid ){

		//判断当前网络状况  和  是否 已获取  

		if( navigator.onLine === true ){

		}
		else if( navigator.onLine === true ){

		}

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
				
				var ctnNode = Util.qs('div.todoctn');
				var domNode = document.createElement('ul');
				domNode.className = 'todos';
				domNode.dataset.listid = listid;
				ctnNode.appendChild( domNode );

				
				UI.renderAll( data.events, domNode, UI.renderSingalTodo  );
			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				showTip( tip );
			}
			return false;
		}

		function isTodoDomCached( listid ){
			/* todo是否已缓存
			 * 先查看是否已在dom中缓存
			 * 在查看是否已在localStorage中缓存
			 * 
			 */

			 if( Util.qs( '.todos[data-listid="' + listid + '"]' ).length === 0 ){
			 	return false;
			 }
			 else{
			 	return true;
			 }
		}

		function isTodoStorageCached( listid ){
			/* todo是否已缓存
			 * 先查看是否已在dom中缓存
			 * 在查看是否已在localStorage中缓存
			 * 
			 */

			 if( Util.qs( '.todos[data-listid="' + listid + '"]' ).length === 0 ){
			 	return false;
			 }
			 else{
			 	return true;
			 }
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