define(function(require, exports, module){ 
	var Util = require('./Util');
	var Conf = require('./Config');
	var Valid = require('./Valid');

	var List = function( args ){
		this.listName = args[0];
		if( args[1] ){
			this.listId = args[1];
		}
	}
	List.prototype.modify = function(){};

	function newList( str,token,callback ){
		var param = {
			action:'new',
			list_name: str,
			token: token
		}
		Util.ajaxPost( Conf.listUrl, param ,callback);
	}

	function getLists( token,callback){
		var param = {
			action:'get',
			token: token
		}
		Util.ajaxPost( Conf.listUrl, param ,callback);
	}
	// 可以将它做成多态的函数： 有listid传进来，说明是一个已经在服务端存在的列表，调用建立实体的函数，
	// 没有listid的时候，调用新建列表的请求新建列表
	exports.newList = newList;
	exports.getLists = getLists;
})