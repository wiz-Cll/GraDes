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
	List.prototype.modify = function(){};
	List.prototype.get = function( token ){
		getLists(token);
	};


	function newList( str,token,callback ){
		var param = {
			action:'new',
			list_name: str,
			token: token
		};
		Util.ajaxPost( Conf.listUrl, param ,callback);
	}

	function deleteList( token, listid, callback ){
		var param = {
			action:'del',
			list_id: listid,
			token: token
		};
		Util.ajaxPost( Conf.listUrl, param, cbInner);

		function cbInner( data ){

			if( data.error_code === 0){
				cbDeleteList( data.list_id );
			}
			else{
				var localErrMap = {};
				Seed.showTip( Util.errMap[ data.error_code ]);
			}
			return false;

			function cbDeleteList( listId ){
				// 将已删除的list的节点删除,或隐藏
				// todo 删除后的动画
				// 删除的后续操作也完成了: 同时将localstorage中的对象清除掉
				// todo 是不要抽出方法呢？ localStorage的操作： 增删查改···
				var listToDel =  Util.qs('.list[data-listid="' + listId + '"]');
				listToDel.style.display = 'none';
				console.log( '刚才删除的列表的节点是: ' + listToDel );
				// todo lists的键值加密和解密
				var storedList = JSON.parse( window.localStorage[ Seed.listsKey ] );
				console.log('本地存储的所有列表如下： '+ storedList + ',共有多少个呢```' + storedList.length);
				for( var i in storedList ){
					if( storedList[i].list_id === listId ){
						storedList.splice(i,1);
						break;
					}
				}

				localStorage[  Seed.listsKey ] = JSON.stringify( storedList );
				return;
			}
		}
	}

	function getLists( token, blNetFirst, blNetMust ){
		var param = {
			action:'get',
			token: token
		};
		Seed.allMityOp( getListsFromRemote, getListsFromStorage, param, blNetFirst, blNetMust );
		function getListsFromRemote( param ){
			Util.ajaxPost( Conf.listUrl, param , function( data ){
				cbGetLists(data);
			});
		}

		function getListsFromStorage( param, blNetFirst ){
			if( Seed.isStorageCached( Seed.listsKey ) ){

			}
		}
		
		function cbGetLists( data ){
			var localErrMap = {};
			if( data.error_code === 0){
				if( data.lists ){
					UI.renderAll( data.lists, Util.qs('#lists'), UI.renderSingleList, function(){
						cnRenderAll( data.lists );
					});

					var storageListStr = JSON.stringify( data.lists );
					window.localStorage['lists'] = storageListStr;
				}
				else{
					Seed.showTip('没有列表');
				}
			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				Seed.showTip( tip );
			}

			function cnRenderAll( listsObjArr ){
				var target = Util.qs('#lists li');
				// Util.Event.trigger( target, 'click');
				var listid = target.dataset.listid;
				Todo.get( Seed.token, listid, true);
				Util.addClass( target, 'active');
			}
			return false;
		}
	}	

	function modifyList( token, listid, newListStr, blNetFirst, blNetMust ){

	}

	function bindHandler(){

		bindListsClickHandler();
		bindAddListClickHandler();
		bindAddListInputEnterHandler();
		bindAddListInputBlurHandler();
		bindRemoveListClickHandler();

		// 点击list的ul的操作
		function bindListsClickHandler(){
			Util.Event.addHandler( Util.qs('#lists'), 'click',function( e ){
				var target = Util.Event.getTarget( e );
				switch( target.className ){
					case 'list':
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

					case 'listshare':
						alert('add share');
						break;
					default:
						//在一个时间只能有一个active 
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
			Util.Event.addHandler( Util.qs('#add-list input'), 'keydown', function( e ){
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

	}
	// 可以将它做成多态的函数： 有listid传进来，说明是一个已经在服务端存在的列表，调用建立实体的函数，
	// 没有listid的时候，调用新建列表的请求新建列表
	exports.newList = newList;
	exports.getLists = getLists;
	exports.bind = bindHandler;
});