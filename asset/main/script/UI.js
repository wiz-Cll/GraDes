define( function( require, exports, module){
	var Util = require('./Util');
	function initUI(){
		var aside = Util.qs('aside');
		var section = Util.qs('section');
		console.log( aside.innerText );
		console.log( section.innerText );
		section.style.marginLeft = aside.style.width;
	}


	// function bindHandler(){
	// 	bindListHandler();
	// 	function bindListHandler(){
			
	// 	}
	// }



	function renderAllLists( lists, node ){
		var htmlstr = '';
		var  len = lists.length;
		if( len > 0 ){
			for( var i= 0; i< len; i++){
				var listItem = lists[i];
				htmlstr = renderSingleList( listItem, htmlstr );
			}
			node.innerHTML += htmlstr;
			return false;
		}
		else{

		}

	}

	/* @func 渲染列表的原子操作
	 * 传入： list对象
	 * str(在被循环调用需要返回的时候传入str， 只渲染一个的话就不需要了 )
	 * node( 填充的节点 )
	 * 
	 */
	function renderSingleList( list, str, node ){
		if( !str ){
			var htmlstr = '';
		}
		else{
			var htmlstr = '';
			htmlstr += str;
		}
		/* 定义一个list的html结构由一下组成:
		 * listpre 
		 * listname 
		 * listshare 
		 * listevents 
		 */
		var header = '<li class="list" data-listid="' + list.list_id + '">';
		var listpre = '<div class="listpre"></div>';
		var listname = '<div class="listname">'+ list.list_name + '</div>';
		var listshare = '<div class="listshare"> + </div>';
		var listevents = '<div class="listevents">' + list.event_total + '</div>';
		var footer = '</li>'
		htmlstr += header + listpre + listname + listshare + listevents +footer;
		if( node ){
			node.innerHTML += htmlstr;
			return false;
		}
		else{
			// do nothing
			return htmlstr;
		}
	}

	exports.init = initUI;
	// exports.bindHandler = bindHandler;
	exports.renderAllLists = renderAllLists;
	exports.renderSingleList = renderSingleList;
	// exports.init = initUI;
})