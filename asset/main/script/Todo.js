define( function( require, exports, module){
	var Util = require('./Util');
	var UI = require('./UI');
	var Seed = require('./Seed');

	var Conf = require('./Config');
	var Valid = require('./Valid');

	/* 
	 * @func 获取todos
	 * @param token, listid, blNetFirst:是否优先从网络刷新  blNetMust: 是否必须从网络刷新
	 * 一般情况下: 页面初始时会设置blNetFirst    用户手动同步时设置blNetMust
	 * 
	 */
	function getTodos( token, listid, blNetFirst, blNetMust ){
		var param = {
			action: 'get',
			list_id: listid,
			token: token
		};
		Seed.allMityOp( getTodosFromRemote, getTodosFromLocal, param, blNetFirst, blNetMust);
		//判断当前网络状况  和  是否 已获取  

		// if( blNetFirst ){
		// 	if( navigator.onLine === true ){
		// 		Seed.showTip('网络优先,且有网络连接');
		// 		getTodosFromRemote(  token, listid );
		// 	}
		// 	else{
		// 		// 提示 无网
		// 		if( blNetMust ){
		// 			Seed.showTip(' sync failed...');
		// 		}
		// 		else{
		// 			Seed.showTip(' offline ````  try get data from cache');
		// 			getTodosFromLocal( token, listid, blNetFirst);
		// 		}
		// 	}
		// }
		// else{
		// 	getTodosFromLocal( token, listid, blNetFirst );
		// }

		function getTodosFromRemote( param ){
			Util.ajaxPost( Conf.eventUrl, param , function( data ){
				cbGetTodos( data, listid );
			});
		}

		function getTodosFromLocal( param, blNetFirst ){
			var listid = param.list_id;
			var token = param.token;
			var selector = '.todos[data-listid="' + listid + '"]';
			if( Seed.isDomCached( selector ) ){
				// 如果已经在dom中缓存,就不需要在获取了
				// 只需要将todos显示在用户面前就行了
				switchTodos( listid );
			}
			else if( Seed.isStorageCached( listid ) ){
				var localCachedTodoData = JSON.parse( window.localStorage[ listid ] );
				cbGetTodos( localCachedTodoData, listid  );
				Seed.showTip('正在从本地存储中获取数据```');
			}
			else if(blNetFirst){
				// 提示 从本地获取失败
				Seed.showTip('本地也咩有```');
			}
			else{
				getTodosFromRemote( token , listid );
			}
		}


		function cbGetTodos( data, listid ){
			var localErrMap = {};
			if( data.error_code === 0){

				var ctnNode = Util.qs('div.todoctn');
				var domNode = document.createElement('ul');
				domNode.className = 'todos';
				domNode.dataset.listid = listid;
				ctnNode.appendChild( domNode );

				var cbRenderAllTodos = switchTodos;

				UI.renderAll( data.events, domNode, UI.renderSingalTodo, function(){
					// 渲染后的回调,将todos显示出来
					cbRenderAllTodos( listid );
					// 将todos存储
					cacheTodosToStorage( data, listid);
				});

			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				Seed.showTip( tip );
			}
			return false;
		}



		function switchTodos( listid ){
			try{
				Util.removeClass( Util.qs('.todos.active'),'active' );
			}
			catch( err ){

			}
			var curTodos = Util.qs('.todos[data-listid="' + listid + '"]');
			Util.addClass( curTodos,'active');
			console.log( '现在显示的todos是: ');
			console.log( curTodos );
		}

		/* 
		 * 将从网络获取的todos数据存储在localstorage
		 * 只在发生"从网络获取"时调用
		 * 或者用户更新了todos,删除,新建,修改等
		 * 
		 */
		function cacheTodosToStorage( data, listid ){
			window.localStorage[listid] = JSON.stringify( data );
		}
	}

	function createTodo( token, list_id, todo_str){
		var param = {
			action: 'new',
			token: token,
			list_id: list_id,
			event_content: todo_str
		};
		Util.ajaxPost( Conf.eventUrl, param, function( data ){
			console.log( '新建todo返回的数据是: ' + data );
			cbCreateTodo(data);
		});


		function cbCreateTodo( data ){
			if( data.error_code === 0){
				var ctnNode =Util.qs('todos[data-listid="' + list_id + '"]');

				var newTodo = {
					event_id: data.event_id,
					event_content: todo_str,
					event_completed: false
				};
				UI.renderSingalTodo( data.event, null, ctnNode);
				window.localStorage[newTodo] = JSON.stringify( newTodo );
			}
		}
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
					console.log( '用户键入的列表名称是： ' + e.target.value );
					todoContent = e.target.value;
					var listId = Util.qs('.list.active').dataset.listid;
					createTodo( Seed.token, listId, todoContent);
				}
			});
		}
	}

	exports.get = getTodos;
	exports.bind = bindHandler;
	exports.create = createTodo;

});