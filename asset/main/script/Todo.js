define( function( require, exports, module){
	var Util = require('./Util');
	var UI = require('./UI');
	var Seed = require('./Seed');

	var Conf = require('./Config');
	var Valid = require('./Valid');


	function newTodo( token, list_id, todo_str){
		var param = {
			action: 'new',
			token: token,
			list_id: list_id,
			event_content: todo_str
		};

		Seed.allMityOp( newToRemote, newToLocal, param, true );
		function newToRemote( param ){
			Util.ajaxPost( Conf.eventUrl, param, function( data ){
				if( data.error_code === 0 ){
					param.evetn_id = data.evetn_id;
					cbNewTodo( param );
				}
				else{
					var errMsg = Util.errMap[ data.error_code ];
					Seed.showTip( errMsg );
				}
			});
		}
		function newToLocal( param ){
			param.evetn_id = ( new Date() ).valueOf();
			cbNewTodo( param );

			// 加入到changelist
			var newChangeObj = {
				action: 'new',
				type:'todo',
				url: Conf.eventUrl,
				obj: param
			};

			Seed.writeIntoChangeList( newChangeObj );
		}
		


		function cbNewTodo( param ){
			// 渲染一个新的todo
			var ctnNode =Util.qs('.todos[data-listid="' + list_id + '"]');
			var newTodo = {
				event_id: param.event_id,
				event_content: param.event_content,
				event_completed: false
			};
			UI.renderSingalTodo( param, null, ctnNode);

			// 缓存到本地存储
			var listId = param.list_id;
			var todoArr = [];
			if( Seed.isStorageCached( listId ) ){
				var todoStr = window.localStorage[ listId ];
				todoArr = JSON.parse( todoStr );
			}
			else{

			}
			todoArr.push( newTodo );

			Seed.cacaheToLocal( listId, todoArr );

			// 清空添加的输入框
			var todoInput = Util.qs('#todo-input');
			todoInput.value = '';
			todoInput.focus();
		}
	}

	function deleteTodo(){

	}
	function modifyTodo(){

	}
	function completeTodo( token, listId ){
		var param = {
			action: 'completed',
			token: token,
			list_id: listId
		};

		Seed.allMityOp( completeToRemote, completeToLocal, param, true );

		function completeToRemote(param){
			Util.ajaxPost( Conf.eventUrl, param, function( data ){
				if( data.error_code === 0 ){
					cbComplete( param );
				}
				else{
					var errMsg = Util.errMap[ data.error_code ];
					Seed.showTip( errMsg );
				}
			});
		}
		function completeToLocal(param){
			var newChangeObj = {
				action: 'completed',
				type: 'todo',
				obj: param
			}
			Seed.writeIntoChangeList( newChangeObj );
		}
		function cbComplete(param){

		}
	}
	function startTodo(){

	}

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

		function getTodosFromRemote( param ){
			Util.ajaxPost( Conf.eventUrl, param , function( data ){
				if( data.error_code === 0 ){
					cbGetTodos( listid, data.events);
				} else {

				}
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
				var localCachedTodoStr =  window.localStorage[ listid ];
				if( !!localCachedTodoStr ){
					var localCachedTodoData = JSON.parse( window.localStorage[ listid ] );
					cbGetTodos(  listid, localCachedTodoData );
					Seed.showTip('正在从本地存储中获取数据```');
				}
				else {
					Seed.showTip('该列表无事务');
				}
			}
			else if(blNetFirst){
				// 提示 从本地获取失败
				Seed.showTip('本地也咩有```');
			}
			else{
				getTodosFromRemote( param , listid );
			}
		}


		function cbGetTodos( listid, todos ){
				var ctnNode = Util.qs('div.todoctn');
				var domNode = document.createElement('ul');
				domNode.className = 'todos';
				domNode.dataset.listid = listid;
				ctnNode.appendChild( domNode );

				var cbRenderAllTodos = switchTodos;

				UI.renderAll( todos, domNode, UI.renderSingalTodo, function(){
					// 渲染后的回调,将todos显示出来
					cbRenderAllTodos( listid );
					// 将todos存储
					if( !todos ){
						todos = '';
					}
					Seed.cacaheToLocal( listid, todos );
				});
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
					newTodo( Seed.token, listId, todoContent);
				}
			});
		}
	}

	exports.get = getTodos;
	exports.bind = bindHandler;
	exports.new = newTodo;

});