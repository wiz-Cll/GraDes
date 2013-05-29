define(function(require, exports, module){
	var Util = require('./Util');
	var Conf = require('./Config');
	var Valid = require('./Valid');
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

	function getLists( token ){
		var param = {
			action:'get',
			token: token
		};
		Util.ajaxPost( Conf.listUrl, param , function( data ){
			var localErrMap = {};
			if( data.error_code === 0){
				if( data.lists ){
					UI.renderAll( data.lists, Util.qs('#lists'), UI.renderSingleList, renderAllCB);
				}
				else{
					Util.showTip('没有列表');
				}
			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				Util.showTip( tip );
			}

			function renderAllCB(){
				var target = Util.qs('#lists li');
				Util.Event.trigger( target, 'click');
			}
			return false;
		});
	}

	function deleteList( token, listid){
		var param = {
			action:'delete',
			list_id: listid,
			token: token
		};
		Util.ajaxPost( Conf.listUrl, param, callback);
	}

	function bindHandler(){

		// 点击list的ul的操作
		Util.qs('#lists').addEventListener('click',function( e ){
			var target = Util.Event.getTarget( e );
			switch( target.className ){
				case 'list':
					try{
						Util.removeClass( Util.qs('.list.active'),'active' );
					}
					catch( err ){

					}
					Util.addClass( target, 'active' );
					Todo.get( Util.token, e.target.dataset.listid );
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
					Todo.get( Util.token, listNode.dataset.listid );
					console.log( target.className );
					// break; 
			}
		}, false);

		/*
		 * 添加list的操作
		 * 1. 用户点击"添加"按钮,改变父元素的类,隐藏p显示input
		 * 2. 用户输入,回车,创建一个列表
		 *    (1).设定渲染单个list的回调
		 *    (2).添加成功后清空input
		 * 3. 用户点击input外的地方,去除#add-ist的类
		 * 
		 */
		Util.Event.addHandler( Util.qs('#add-list p'), 'click',function( e ){
			Util.addClass( e.target.parentNode, 'editing');
			Util.qs('#add-list input').focus();
			console.log( e.target.tagName );
		});

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
					newList( listName, Util.token, callback);
				}
				else{
					// 名字为空  不做操作
				}
			}
		});

		Util.Event.addHandler( Util.qs('#add-list input'), 'blur', function( e ){
			Util.removeClass( Util.qs('#add-list'), 'editing' );
			return false;
		});
	}
	// 可以将它做成多态的函数： 有listid传进来，说明是一个已经在服务端存在的列表，调用建立实体的函数，
	// 没有listid的时候，调用新建列表的请求新建列表
	exports.newList = newList;
	exports.getLists = getLists;
	exports.bind = bindHandler;
})