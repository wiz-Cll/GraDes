define(function(require, exports, module){
	var Util = require('./Util');
	var Conf = require('./Config');
	var Valid = require('./Valid');
	var Seed = require('./Seed');

	var UI = require('./UI');
	var Todo = require('./Todo');

	var List = function( args ){
		this.listName = args[0];
		if( args[1] ){
			this.listId = args[1];
		}
	};
	// List.prototype.modify = function(){};
	List.prototype.get = function( token ){
		getLists(token);
	};


	function newList( str,token,callback ){
		var param = {
			action:'new',
			list_name: str,
			token: token
		};

		Seed.allMityOp( newListToRemote, newListToLocal, param, true );

		function newListToRemote( param ){
			Seed.ajaxPost( Conf.listUrl, param ,function( data ){
				if( data.error_code === 0){

					var newList = {
						list_id: data.list_id,
						list_name: param.list_name,
						event_total: 0
					};
					cbNewList( newList );
				} else {
					// Seed.showTip( Util.errMap[ error_code ] );
				}
			});
		}
		/*
		 * 离线新建的列表，由于没有guid，暂时使用timeStamp代替
		 * 因此渲染UI的操作需要兼容这个键值：取值的长度需要验证一下
		 * 
		 * 
		 */
		function newListToLocal( param ){
			// 创建虚假的list对象，listid为操作的时间戳
			var newList = {
				list_id: (new Date()).valueOf(),
				list_name: param.list_name,
				event_total: 0
			};

			// 跟正常的list对象一样渲染
			cbNewList( newList );

			// 将更改存储到changelist
			var newChangeObj = {
				action: 'new',
				url: Conf.listUrl,
				obj: newList
			}
			Seed.writeIntoChangeList( newChangeObj );
		}

		function cbNewList( newList ){
			var listsCtn = Util.qs('#lists');
			// 直接调用renderSingal需要设置htmlstr为undefined或其他false值
			UI.renderSingleList( newList, null, listsCtn, cbRenderNewList );

			// 将新建的列表cached到本地存储
			if( Seed.isStorageCached( Seed.listsKey ) ){
				var listsStr = window.localStorage[ Seed.listsKey ];
				var listsObj = JSON.parse( listsStr );
				listsObj.push( newList );
			} else {
				var listsObj = [];
				listsObj.push( newList );
			}

			Seed.cacaheToLocal( Seed.listsKey, listsObj );

			function cbRenderNewList(){
				// console.log('新建列表的动画。。。');
				var target = Util.qs('#lists li[data-listid="' + newList.list_id + '"]');
				UI.changeClass4ani( target, 'list' );
				Util.addClass( target, 'active');

				// 给这个list制造空的todos的localcache
				Seed.cacaheToLocal( newList.list_id, '' );
				// 切换list的激活状态
				Util.Event.trigger(target, 'click');
				// 注  点击之后会发生addlist的input的blur事件

				// 清空新建表单的内容
				var newListInput = Util.qs('#add-list input');
				newListInput.value = '';
				Util.Event.trigger( newListInput, 'blur' );
			}
		}
	}

	function deleteList( token, listid, callback ){
		var param = {
			action:'del',
			list_id: listid,
			token: token
		};

		Seed.allMityOp( deleteListFromRemote, deleteListFromLocal, param, true);

		function deleteListFromRemote( param ){
			Seed.ajaxPost( Conf.listUrl, param, function( data ){
				if( data.error_code === 0 ){
					cbDeleteList( param );
				}
				else{
					var localErrMap = {};
					// Seed.showTip( Util.errMap[ data.error_code ]);
				}
				return false;
			});
		}
		function deleteListFromLocal( param ){
			var listId = param.list_id;
			cbDeleteList( param );
			var newChangeObj = {
				action: 'del',
				url: Conf.listUrl,
				obj: param
			}

			Seed.writeIntoChangeList( newChangeObj );
		}

		function cbDeleteList( param ){
			var listId = param.list_id;


			// 将已删除的list的节点删除,或隐藏
			// todo 删除后的动画
			// 删除的后续操作也完成了: 同时将localstorage中的对象清除掉
			// todo 是不要抽出方法呢？ localStorage的操作： 增删查改···
			var listToDel =  Util.qs('.list[data-listid="' + listId + '"]');
			Util.removeClass( listToDel, 'active');
			listToDel.style.display = 'none';
			console.log( '刚才删除的列表的节点是: ' + listToDel );

			// 将缓存的list删除
			// todo lists的键值加密和解密
			Seed.removeFromLocal( Seed.listsKey, 'list_id', listId );
			
			return;
		}
	}

	function getLists( token, blNetFirst, blNetMust ){
		var param = {
			action:'get',
			token: token
		};
		Seed.allMityOp( getListsFromRemote, getListsFromStorage, param, blNetFirst, blNetMust );
		function getListsFromRemote( param ){
			Seed.ajaxPost( Conf.listUrl, param , function( data ){
				if( data.error_code === 0 ){
					cbGetLists(data.lists);
				} else {
					Seed.showTip( Util.errMap[data.error_code] );
				}
			});
		}

		function getListsFromStorage( param, blNetFirst ){
			var token = param.token;
			if( Seed.isStorageCached( Seed.listsKey ) ){
				var listsStr = window.localStorage[ Seed.listsKey ];
				var listsObj = JSON.parse( listsStr );
				// var data = {
				// 	error_code: 0,
				// 	lists: listsObj
				// }
				cbGetLists( listsObj );
			}
		}
		
		function cbGetLists( lists ){
			
			if( lists ){
				UI.renderAll( lists, Util.qs('#lists'), UI.renderSingleList, function(){
					cbRenderAll( lists );
				});

				// var storageListStr = JSON.stringify( lists );
				// window.localStorage['lists'] = storageListStr;
				Seed.cacaheToLocal( 'lists', lists);
			}
				

			function cbRenderAll( listsObjArr ){
				var target = Util.qs('#lists li');
				// Util.Event.trigger( target, 'click');
				var listid = target.dataset.listid;
				Todo.get( Seed.token, listid, true);
				Util.addClass( target, 'active');

				bindHandler();
			}
			return false;
		}
	}	

	function modifyList( token, listid, newListStr, blNetFirst, blNetMust ){
		var param = {
			action: 'changename',
			token: token,
			list_name_new: newListStr,
			list_id: listid
		};
		Seed.allMityOp( modifyToRemote, modifyToLocal, param, true);

		function modifyToRemote( param ){
			Seed.ajaxPost( Conf.listUrl, param, function( data ){
				if( data.error_code === 0 ){
					cbModify( param );
				}
				else{
					var errMsg = Util.errMap[ data.error_code ];
					// Seed.showTip( errMsg );
				}
			});
		}
		function modifyToLocal( param ){
			cbModify( param );

			// 保存到changelist
			var changeObj = {
				action: 'modify',
				type: 'list',
				url: Conf.listUrl,
				obj: param
			}
			Seed.writeIntoChangeList( changeObj );
		}

		function cbModify( param ){

			var listid = param.list_id;
			var listsArr = [];
			// 修改本地的缓存
			if( Seed.isStorageCached( Seed.listsKey ) ){
				var listsStr = window.localStorage[ Seed.listsKey ];
				listsArr = JSON.parse( listsStr );
				for( var i = 0, len = listsArr.length; i < len; i++ ){
					if( listsArr[i].list_id === listid ){
						listsArr[i].list_name = param.list_name_new;
						break;
					}
				}
			}
			else{
				listsArr[0].list_id = listid;
				listsArr[0].list_name = param.list_name_new;
			}
			Seed.cacaheToLocal( Seed.listsKey, listsArr);

			// 修改展示在用户面前的listname
			var listNode = Util.qs('#lists .list[data-listid="' + listid + '"]');
			var listNodeName = Util.qs('#lists .list[data-listid="' + listid + '"] .listname');
			listNodeName.innerHTML = param.list_name_new;
			// 去除editing的类
			Util.removeClass(listNode, 'editing');
		}
	}

	function bindHandler(){
		// 绑定的最佳时机应该是获取了列表之后

		bindListsClickHandler();
		bindAddListClickHandler();
		bindAddListInputEnterHandler();
		bindAddListInputBlurHandler();
		bindRemoveListClickHandler();
		bindEditListDbclickhandler();

		// 点击list的ul的操作
		function bindListsClickHandler(){
			Util.Event.addHandler( Util.qs('#lists'), 'click', function( e ){
				var target = Util.Event.getTarget( e );
				switch( target.className ){
					case 'list':
						try{
							Util.removeClass( Util.qs('.list.editing'),'editing' );
						}
						catch( err ){

						}
						try{
							Util.removeClass( Util.qs('.list.active'),'active' );
						}
						catch( err ){
							
						}
						Util.addClass( target, 'active' );
						Todo.get( Seed.token, e.target.dataset.listid );
						break;
					case 'list active':
						// donothing
						break;
					case 'listname-input':
						break;
					case 'listshare':
						alert('add share');
						break;
					default:
						//在一个时间只能有一个active 
						try{
							Util.removeClass( Util.qs('.list.editing'),'editing' );
						}
						catch( err ){

						}
						try{
							Util.removeClass( Util.qs('.list.active'),'active' );
						}
						catch( err ){

						}
						
						var  listNode = target.parentNode;
						Util.addClass( listNode, 'active' );
						Todo.get( Seed.token, listNode.dataset.listid );
						console.log( '你点击的列表节点的子节点的className是: ' + target.className );
						// break;
				}
			});
		}


		/*
		 * 添加list的操作
		 * 1. 用户点击"添加"按钮,改变父元素的类,隐藏p显示input
		 * 2. 用户输入,回车,创建一个列表
		 *    (1).设定渲染单个list的回调
		 *    (2).添加成功后清空input
		 * 3. 用户点击input外的地方,去除#add-ist的类
		 * 
		 */
		function bindAddListClickHandler(){
			Util.Event.addHandler( Util.qs('#add-list p'), 'click',function( e ){
				Util.addClass( e.target.parentNode, 'editing');
				Util.qs('#add-list input').focus();
				// console.log( e.target.tagName );
			});
		}

		function bindAddListInputEnterHandler(){
			Util.Event.addHandler( Util.qs('#add-list input'), 'keyup', function( e ){
				var keyCode = Util.Event.getCharCode( e );
				if( keyCode === 13){
					// 新建list
					var target = Util.Event.getTarget( e );
					var listName = target.value;
					if( listName.trim() !== ''){
						function callback( data ){
							var list = {
								list_name: listName,
								list_id: data.list_id,
								event_total: 0
							}
							UI.renderSingleList( list, null, Util.qs('#lists'), function( node ){
								var args = arguments;
								var demnode = Util.qs('#lists .temp')
								UI.changeClass4ani( demnode, 'list');
								target.value = '';
							});
						}
						newList( listName, Seed.token, callback);
					}
					else{
						// 名字为空  不做操作
					}
				}
			});
		}
		function bindAddListInputBlurHandler(){
			Util.Event.addHandler( Util.qs('#add-list input'), 'blur', function( e ){
				Util.removeClass( Util.qs('#add-list'), 'editing' );
				return false;
			});
		}

		/*
		 * 删除节点的操作: 删除当前active的list
		 * process: 获取list_id
		 * 发送请求,监控请求
		 * 在成功后去除该list的dom节点
		 * 
		 */
		function bindRemoveListClickHandler(){
			Util.Event.addHandler( Util.qs('#delete-list'), 'click', function(e){
				var ListObj = Util.qs('.list.active');
				var listId = ListObj.dataset.listid;
				deleteList( Seed.token, listId );
			});
		}


		/*
		 * 修改列表名称的操作
		 * 双击修改（还是类名）
		 * 
		 * 
		 */

		function bindEditListDbclickhandler(){
		 	bindModifyInputEnterHandler();
		 	Util.Event.addHandler( Util.qs('#lists'), 'dblclick', function( e ){
		 		var target = e.target;
		 		switch( target.className ){
		 			case 'listname':
		 				var domNode = target.parentNode;
		 				changeLClassForEdit( domNode );
		 				var currentModifyInput = target.nextSibling;
		 				currentModifyInput.focus();
		 				bindModifyInputBlurHandler( currentModifyInput );
		 				break;
		 			// case 'listname':
		 			// 	break;
		 			default:
		 				break;
		 		}
		 		function changeLClassForEdit( domNode ){
		 			Util.addClass( domNode, 'editing' );
		 		}
		 		// console.log( e );
		 	});

		 	function bindModifyInputEnterHandler(){
	 			// var modifyInputAll = Util.qsa('#lists .listname-input');
	 			var modifyInput = Util.qs('#lists');

	 			Util.Event.addHandler( modifyInput, 'keyup', function( e ){
	 				var keyCode = Util.Event.getCharCode( e );
	 				if( keyCode === 13){
	 					console.log( e );
		 				var target = e.target;
		 				checkAndSave( target );
	 				}
	 			});
	 		}

	 		function bindModifyInputBlurHandler( currentModifyInput ){
	 			// 由于blur并不冒泡，所以不能使用事件代理···
	 			Util.Event.addHandler( currentModifyInput, 'blur', function( e ){
	 				checkAndSave( currentModifyInput );
	 			});
	 		}

	 		function checkAndSave( currentModifyInput ){
	 			var newName = currentModifyInput.value;
	 			var oldName =  currentModifyInput.previousSibling.innerText;
 				if( Util.trim( newName ) !== oldName ){
 					var listId = currentModifyInput.parentNode.dataset.listid;
 					saveModify( listId, newName );
 				}
 				else{

 				}
 				backToNormal( currentModifyInput );
	 		}

	 		function backToNormal( currentModifyInput ){
	 			var listNode = currentModifyInput.parentNode;
	 			Util.removeClass( listNode, 'editing');
	 		}

	 		function saveModify( listId, newName ){
	 			modifyList( Seed.token, listId, newName, true );
	 		}
		}

	}
	// 可以将它做成多态的函数： 有listid传进来，说明是一个已经在服务端存在的列表，调用建立实体的函数，
	// 没有listid的时候，调用新建列表的请求新建列表
	exports.newList = newList;
	exports.getLists = getLists;
	exports.bind = bindHandler;
});