define(function(require, exports, module){ 
	var Util = require('./Util');
	var Conf = require('./Config');
	var Valid = require('./Valid');
	var UI = require('./UI');
	var Event = require('./Event');

	var List = function( args ){
		this.listName = args[0];
		if( args[1] ){
			this.listId = args[1];
		}
	}
	List.prototype.modify = function(){};
	List.prototype.get = function( token ){
		getLists(token);
	}

	function newList( str,token,callback ){
		var param = {
			action:'new',
			list_name: str,
			token: token
		}
		Util.ajaxPost( Conf.listUrl, param ,callback);
	}

	function getLists( token ){
		var param = {
			action:'get',
			token: token
		}
		Util.ajaxPost( Conf.listUrl, param , function( data ){
			var localErrMap = {};
			if( data.error_code == 0){
				if( data.lists ){
					UI.renderAllLists( data.lists, Util.qs('#lists'));
				}
				else{
					Util.showTip('没有列表');
				}
			}
			else{
				var tip = localErrMap[ data.error_code ] || Util.errMap[ data.error_code ];
				Util.showTip( tip );
			}
			return false;
		});
	}

	function bindHandler(){
		Util.qs('#lists').addEventListener('click',function( e ){
			var target = e.target;
			switch( target.className ){
				case 'list':
					try{
						Util.removeClass( Util.qs('.list.active'),'active' );
					}
					catch( err ){

					}
					Util.addClass( target, 'active' );
					break;
				// case 'listpre':
				// 	target.className +=' active';
				// 	break;
				// case 'listname':
				// 	target.className +=' active';
				// 	break;
				// case 'listevents':
				// 	target.className +=' active';
				// 	break;

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
					Util.addClass( listNode, ' active' );
					Event.get( Util.token, listNode.dataset.listid );
					console.log( target.className );
					break; 
			}
		}, false);
	}
	// 可以将它做成多态的函数： 有listid传进来，说明是一个已经在服务端存在的列表，调用建立实体的函数，
	// 没有listid的时候，调用新建列表的请求新建列表
	exports.newList = newList;
	exports.getLists = getLists;
	exports.bind = bindHandler;
})