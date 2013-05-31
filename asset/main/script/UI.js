define( function( require, exports, module){
	var Util = require('./Util');
	function initUI(){
		var aside = Util.qs('aside');
		var section = Util.qs('section');
		// console.log( aside.innerText );
		// console.log( section.innerText );
		section.style.marginLeft = aside.style.width;
	}


	/* 
	 * 主要负责 UI的渲染工作
	 * 如渲染获取列表后渲染列表
	 * 
	 * 而当创建一个列表或单个todo的时候 可以用renderSignal的函数 
	 *  
	 *  
	 */


	/*
	 * @func   打包渲染所有列表
	 * @param  lists的data对象，填充的dom节点
	 * @proc   调用render单个列表的函数 可以以性能模式渲染，即拆分到原子html操作的渲染方式
	 *         也可以以特效全开的模式，有transition
	 *    在其中定义的改变类名以实现动画效果呃函数可以抽出来，在渲染事务的时候也可以使用
	 */
	function renderAll( objArr, ctnNode, funcRenderSingal, callback ){
		// 传过来的可能是undefined(没有的时候,服务端返回的没有对象数组)
		if( objArr ){
			var htmlstr = '';
			var  len = objArr.length;
			if( len > 0 ){
				for( var i= 0; i< len; i++){
					var objItem = objArr[i];
					htmlstr = funcRenderSingal( objItem, htmlstr, ctnNode );
				}
				if( htmlstr !== false ){
					ctnNode.innerHTML += htmlstr;
				}
				else{
					var objNodes = Util.qsa('.temp');

					for( var i = 0, len = objNodes.length; i < len; i++ ){
						var index= i;

						changeClass4ani( objNodes[index], 'list' );
					}

					// Util.Event.trigger( objNodes[0], 'click');

					// 
				}

			}
			else{
				// todo  传过来的对象数组长度为0时 怎么办
			}
		}
		else{
			// todo 传过来的为undefined时 
		}


		if( callback instanceof Function){
			callback();
		}
		return false;
	}

	/* @func   渲染列表的原子操作
	 * @param  list的data对象
	 *         str(在被循环调用需要返回的时候传入str， 只渲染一个的话就不需要了 )
	 *         node( 填充的节点 ) 可选  如果传了这个参数，就会单个单个的渲染，而且不再返回htmlstr 而是false
	 *  注：如果为了实现动画一般都是要单个单个渲染的  当然也可以全部渲染  然后在全部渲染结束后定义动画等···
	 */
	function renderSingleList( list, str, ctnNode, callback ){
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
		// var header = '<li class="list" data-listid="' + list.list_id + '">';
		var header = '<li class="temp" data-listid="' + list.list_id + '">';
		// 里面放置列表图标 和 删除按钮
		var listpre = '<div class="listpre"></div>';
		var listname = '<div class="listname">'+ list.list_name + '</div>';
		var listshare = '<div class="listshare"> + </div>';
		var listevents = '<div class="listtodos">' + list.event_total + '</div>';
		var footer = '</li>';
		htmlstr += header + listpre + listname + listshare + listevents + footer;
		if( ctnNode ){
			ctnNode.innerHTML += htmlstr;
		}
		else{
			// do nothing
			return htmlstr;
		}

		if( callback instanceof Function ){
			callback();
		}

		return false;

	}



	function renderSingalTodo( todo, str, ctnNode ){
		if( !str ){
			var htmlstr = '';
		}
		else{
			var htmlstr = '';
			htmlstr += str;
		}

		// todoPre  应该分为 已完成  和 未完成
		// console.log( typeof todo.event_completed );
		var doneOrNot = todo.event_completed ? 'checked' : '';

		// var header = '<ul>'
		var todoPre = '<li class="todo" data-todoid="' + todo.event_id + '"> <div class="todopre"><input type="checkbox" class="" value="' + doneOrNot + '" /> </div>';
		var todoTail = '<div class="todotail"></div>';

		var todoBody = '<div class="todobody">' + todo.event_content + '</div> </li>';


		// 由于三列布局的要求，要先写tail  再写body
		htmlstr += todoPre + todoTail + todoBody;

		if( ctnNode ){
			ctnNode.innerHTML += htmlstr;
			// console.log( ctnNode.innerHTML );
			// console.log( htmlstr );
			return false;
		}
		else{
			return htmlstr;
		}
	}



	/*
	 * 将来可能全部由他来实现动画
	 * dom.style.webkitTransition = 'property duration delay timefunc'
	 * 
	 * 
	 */
	function changeClass4ani( node, className ){
		node.className = className;
		// if( node.class == 'temp' ){
			// Util.addClass( node, className );
		// }

	}
	exports.init = initUI;
	// exports.bindHandler = bindHandler;

	exports.renderAll = renderAll;
	exports.renderSingleList = renderSingleList;
	exports.renderSingalTodo = renderSingalTodo;
	exports.changeClass4ani = changeClass4ani;
	// exports.init = initUI;
});