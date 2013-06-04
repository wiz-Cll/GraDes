define(function(require, exports, module){
	var Util = require('./Util');


	var token = '41E09A93C35BF3C8F3E4E6DE424C409A';
	var listsKey = 'lists';
	function showTip( str ){
		// 用户提示与反馈
		// 优雅降级的iOS提示
		// 高度的一致性

		/* 
		 * 获取tip节点,然后查看是否正在transition中,如果还在transition,说明是连续来了两个消息
		 * 待完善,先做点工作上的事情吧
		 * 
		 * 
		 */
		var tip = Util.qs('#tip');
		var trans = Util.qsa('#tip .trans');
		// var tip = document.querySelector('#tip');
		// var trans = document.querySelectorAll('#tip .trans');
		try{
			var stageNo = parseInt( tip.className.slice(-1) );
			trans[stageNo+1].innerHTML = str;

			Util.addClass(trans[stageNo+1], 'infoStyle');
			// console.log( Util );
			tip.className = 'stage_'+(stageNo+1);
			setTimeout( backTipDefaultStyle,3000);
		}
		catch( err ){
			alert('showtip 出错,  '+ err);
		}

		function backTipDefaultStyle(){
			// 应该根据现在的状态改变tip的类名
			tip.className = 'stage_0';
		}
		return false;
	}
	function isDomCached( selector ){
		/* todo是否在dom中已缓存
		 */

		if( Util.qs( selector ) ){
			return true;
		}
		else{
			return false;
		}
	}
	function isStorageCached( key ){
		/* todo是否在localstorage中已缓存
		 */
		var localStorage = window.localStorage;
		if( localStorage[key] ){
			return true;
		}
		else{
			return false;
		}
	}

	function allMityOp( fucRemote, funcLocal, param, blNetFirst, blNetMust){
		if( blNetFirst ){
			if( navigator.onLine ){
				this.showTip('网络优先,且有网络连接');
				fucRemote(  param );
			}
			else{
				if( blNetMust ){
					this.showTip(' sync failed...');
				}
				else{
					this.showTip(' offline ````  try get data from cache');
					funcLocal( param, blNetFirst);
				}
			}
		}
		else{
			funcLocal( param, blNetFirst);
		}
	}

	// function dataHandler( data, sucFunc){
	// 	if( data.error_code === 0 )
	// }

	function cacaheToLocal( key, value ){
		console.log('缓存的key是： ');
		console.log( key );
		console.log('缓存的value是： ');
		console.log( value );
		window.localStorage[ key ] = JSON.stringify( value );
	}

	function writeIntoChangeList( newChangeObj ){
		var changeArr = [];
		if( window.localStorage.changeList ){
			var changeStr = window.localStorage.changeList;
			changeArr = JSON.parse( changeStr );
		} else {
			// do nothing
		}
		changeArr.push( newChangeObj );

		this.cacaheToLocal( 'changeList', JSON.stringify( changeArr ) );

	}

	exports.token = token;
	exports.listsKey = listsKey;

	exports.showTip = showTip;
	exports.isDomCached = isDomCached;
	exports.isStorageCached = isStorageCached;
	exports.allMityOp = allMityOp;

	exports.cacaheToLocal = cacaheToLocal;
});