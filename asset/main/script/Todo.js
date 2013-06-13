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
			Seed.ajaxPost( Conf.eventUrl, param, function( data ){
				if( data.error_code === 0 ){
					param.evetn_id = data.evetn_id;
					cbNewTodo( param );
				}
				else{
					var errMsg = Util.errMap[ data.error_code ];
					// Seed.showTip( errMsg );
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
			var listId = param.list_id;

			// 渲染一个新的todo
			// Seed.showTip('新建成功！');
			var ctnNode =Util.qs('.todos[data-listid="' + listId + '"]');
			var newTodo = {
				event_id: param.event_id,
				event_content: param.event_content,
				event_completed: false
			};
			UI.renderSingalTodo( param, null, ctnNode);

			// 改变list的total值
			changeListTodoTotal( 1, listId )

			// 缓存到本地存储
			Seed.addObjToLocal( listId, newTodo );

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
	function completeTodo( token, eventId, listId ){
		var param = {
			action: 'completed',
			token: token,
			event_id: eventId,
		};

		Seed.allMityOp( completeToRemote, completeToLocal, param, true );

		function completeToRemote(param){
			Seed.ajaxPost( Conf.eventUrl, param, function( data ){
				if( data.error_code === 0 ){
					cbComplete( param, listId );
				}
				else{
					var errMsg = Util.errMap[ data.error_code ];
					// Seed.showTip( errMsg );
				}
			});
		}
		function completeToLocal(param){
			cbComplete(param, listId);
			var newChangeObj = {
				action: 'completed',
				type: 'todo',
				obj: param
			}
			Seed.writeIntoChangeList( newChangeObj );
		}
		function cbComplete(param, listId){
			// var listId = param.list_id;
			// 将todo置为完成状态
			UI.completeTodo( param.event_id );

			// 缩减list的todo数目
			changeListTodoTotal( -1, listId )

			// 将本地存储的本todo的状态更新
			Seed.changeStorageValueByKey( listId, 'event_id', param.event_id, 'event_completed', true);
		}
	}
	function starTodo( token, eventId, listId ){
		var param = {
			action: 'starred',
			token: token,
			event_id: eventId
		};

		Seed.allMityOp( starToRemote, starToLocal, param, true );

		function starToRemote(param){
			Seed.ajaxPost( Conf.eventUrl, param, function(data){
				
			});
		}
		function starToLocal(param){

		}
		function cbStar(param){

		}
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
			Seed.ajaxPost( Conf.eventUrl, param , function( data ){
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
				Seed.switchNode( '.todos', '.todos[data-listid="' + listid + '"]' );
			}
			else if( Seed.isStorageCached( listid ) ){
				var localCachedTodoStr =  window.localStorage[ listid ];
				if( !!localCachedTodoStr ){
					// todo: 判断数组为空···
					var localCachedTodoData = JSON.parse( window.localStorage[ listid ] );
					cbGetTodos(  listid, localCachedTodoData );
					// Seed.showTip('正在从本地存储中获取数据```');
				}
				else {
					// Seed.showTip('该列表无事务');
				}
			}
			else if(blNetFirst){
				// 提示 从本地获取失败
				// Seed.showTip('本地也咩有```');
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

			var cbRenderAllTodos = Seed.switchNode;

			UI.renderAll( todos, domNode, UI.renderSingalTodo, function(){
				// 渲染后的回调,将todos显示出来
				cbRenderAllTodos( '.todos', '.todos[data-listid="' + listid + '"]' );
				// 将todos存储
				if( !todos ){
					todos = '';
				}
				Seed.cacaheToLocal( listid, todos );
			});
			return false;
		}



		// function switchTodos( listid ){
		// 	try{
		// 		Util.removeClass( Util.qs('.todos.active'),'active' );
		// 	}
		// 	catch( err ){

		// 	}
		// 	var curTodos = Util.qs('.todos[data-listid="' + listid + '"]');
		// 	Util.addClass( curTodos,'active');
		// 	console.log( '现在显示的todos是: ');
		// 	console.log( curTodos );
		// }

		/* 
		 * 将从网络获取的todos数据存储在localstorage
		 * 只在发生"从网络获取"时调用
		 * 或者用户更新了todos,删除,新建,修改等
		 * 
		 */
	}

	

	function bindHandler(){

		bindCreate();
		bindComplete();
		bindAchieveClickHandler();

		// 新建输入框的回车事件
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
		// 完成todo的操作
		function bindComplete(){
			var todoCtn = Util.qs('.todoctn');
			Util.Event.addHandler( todoCtn, 'click', function( e ){
				var target = e.target;
				if( target.className === 'todopre' ){
					var todoId = target.dataset.todoid;
					var listId = Util.qs('.todos.active').dataset.listid;
					completeTodo( Seed.token, todoId, listId);
				}
			});
		}

		function bindAchieveClickHandler(){
			var activeAchieveBtn = Util.qs('#complete-todo-btn');
			var achieveBtn = Util.qs('#achieve');

			Util.Event.addHandler( activeAchieveBtn, 'click', function(){
				var cordX = activeAchieveBtn.clientX || activeAchieveBtn.offsetLeft ;
				var cordY = activeAchieveBtn.clientY || activeAchieveBtn.offsetHeight;
				var curStyle = window.getComputedStyle( activeAchieveBtn );
				
				cordX -= 600 - curStyle.width.substr( 0, curStyle.width.indexOf('px') ) -20;
				cordY += parseInt( curStyle.height.substr( 0, curStyle.height.indexOf('px') ) ) + 55;
				Util.popOutField( achieveBtn, cordX, cordY, 'top' );

				var curList = Utils.qs('.todos.active').dataset.listid;
				var curAchieveUl = Util.qs('.completedTodo[data-listid="' + curList + '"]');
				Util.addClass()
			});
		}
	}

	exports.get = getTodos;
	exports.completeTodo = completeTodo;
	exports.bind = bindHandler;
	exports.new = newTodo;


	function changeListTodoTotal( increase, listId ){
		// 本列表的todo数目+1
		// 先是本地存储····
		var newTotal;
		Seed.changeStorageValueByKey( Seed.listsKey, 'list_id', listId, 'event_total', function( curValue ){
			newTotal = curValue + increase;
			return newTotal;
		});
		// 再是dom中的显示···这就显示出mvc架构的优势了，不用手动修改两个地方···
		UI.changeTotal( '.list[data-listid="'+ listId +'"] .listtodos', newTotal);
		// Util.qs('.list[data-listid="'+ listId +'"] .listtodos').innerText = newTotal;

	}
});