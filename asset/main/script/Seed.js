define(function(require, exports, module){
	var Util = require('./Util');


	var token = window.localStorage.token;
	var listsKey = 'lists';
	var showTipST;

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
		try{
			clearTimeout( showTipST );
			var stageNo = parseInt( tip.className.slice(-1) );
			var opTransNo = stageNo+1;
			if( opTransNo < 3 ){
				// tip.className = 'stage_0';
				trans[ opTransNo ].innerHTML = str;
				Util.addClass(trans[ opTransNo ], 'infoStyle');
				tip.className = 'stage_'+( opTransNo );
				showTipST = setTimeout( function(){
					backTipDefaultStyle( opTransNo+1 );
				},3000);
			}
			else{
				// 当连续过来三个通知的时候 四面已经都滚动了  所以需要初始状态
				setTimeout( function(){
					backTipDefaultStyle( opTransNo );
					setTimeout(function(){
						showTip( str );
					}, 1500);
				},3000);
			}
			
		}
		catch( err ){
			alert('showtip 出错,  '+ err);
		}

		function backTipDefaultStyle( stageNo){
			tip.className = 'stage_'+( stageNo );
			// 隐藏tip
			setTimeout( function(){
				tip.className = 'deactive';
				// 清空内容
				for( var i = 0; i< 4; i++){
					trans[i].className = 'trans';
					trans[i].innerHTML = '';
				}
				tip.className = 'stage_0';
			}, 1000);
		}
		return false;
	}

	// 检测dom节点是否存在，已判断是否已在dom中渲染
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
	// 检测key键的本地存储是否存在，以判断是否已在本地存储中缓存
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
	// 全面的函数，判断网络优先，网络条件，本地缓存等来进行操作
	function allMityOp( fucRemote, funcLocal, param, blNetFirst, blNetMust){
		if( blNetFirst ){
			if( navigator.onLine ){
				// this.showTip('网络优先,且有网络连接');
				fucRemote(  param );
			}
			else{
				if( blNetMust ){
					// this.showTip(' sync failed...');
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

	// 将一个全新的键值对存储到本地
	function cacaheToLocal( key, value ){
		console.log('缓存的key是： ');
		console.log( key );
		console.log('缓存的value是： ');
		console.log( value );
		window.localStorage[ key ] = JSON.stringify( value );
	}

	// 在无网络的情况下将一个嫦娥对象保存到changelist  以方便下一步的同步操作
	function writeIntoChangeList( newChangeObj ){
		var changeArr = [];
		if( window.localStorage.changeList ){
			var changeStr = window.localStorage.changeList;
			changeArr = JSON.parse( changeStr );
		} else {
			// do nothing
		}
		changeArr.push( newChangeObj );

		this.cacaheToLocal( 'changeList', changeArr );

	}

	// 改变本地存储中的一个对象的某个键的值
	function changeStorageValueByKey( name, conditionKey, conditionValue, key, newValue){
		if( this.isStorageCached(name) ){
			var objStr = window.localStorage[name];
			var objsArr = JSON.parse( objStr );
			if( conditionKey && conditionValue ){
				for( var i = 0, len = objsArr.length; i < len; i++){
					if( objsArr[i][ conditionKey ] === conditionValue ){
						if( newValue instanceof Function ){
							objsArr[i][ key ] = newValue( objsArr[i][ key ] );
						}
						else{
							objsArr[i][ key ] = newValue;
						}
						break;
					}
				}
			}
			else{
				if( newValue instanceof Function ){
					objsArr[i][ key ] = newValue( objsArr[i][ key ] );
				}
				else{
					objsArr[i][ key ] = newValue;
				}
			}
			this.cacaheToLocal( name, objsArr);
		}
	}

	function addObjToLocal( name, newObj ){
		var cacheArr = [];
		if( this.isStorageCached( name ) ){
			var cacheStr = window.localStorage[name];
			if( !!cacheStr ){
				cacheArr = JSON.parse( cacheStr );
				if( cacheArr instanceof Array ){

				}
				else{
					cacheArr = [];
				}
			}
		}
		cacheArr.push( newObj );
		this.cacaheToLocal( name, newObj );
	}

	// 从本地已缓存的数据中删除一个数组元素
	function removeFromLocal( name, conditionKey, conditionValue ){
		var cacheArr = [];
		if( this.isStorageCached( name ) ){
			var cacheStr = window.localStorage[ name ];
			if( !!cacheStr ){
				cacheArr = JSON.parse( cacheStr );
				for( var i = 0, len = cacheArr.length; i< len; i++ ){
					if( cacheArr[i][conditionKey] === conditionValue ){
						cacheArr.splice( i, 1);
						break;
					}
				}
			}
		}

		if( cacheArr.length !== 0 ){
			this.cacaheToLocal( name, cacheArr );
			return true;
		}
		else{
			window.localStorage[name] = '';
			return false;
		}

	}

	/* 
	 * 此处重载ajax函数
	 * 
	 * 
	 * 
	 */

	function ajaxGet( url, param, cb ){
		Util.ajaxGet( url, param, function( data ){
			if( data.err_code === 7 ){
				localLogin();
			}
			else{
				cb( data );
			}
		});
	}
	function ajaxPost( url, param, cb ){
		Util.ajaxPost( url, param, function( data ){
			if( data.err_code === 7 ){
				localLogin();
			}
			else{
				cb( data );
			}
		});
	}


	function switchNode( selectorAll, selector){
		try{
			Util.removeClass( Util.qs(selectorAll+'.active'),'active' );
		}
		catch( err ){

		}
		var curNode = Util.qs( selector );
		Util.addClass( curNode,'active');
		console.log( '现在显示的是: ');
		console.log( curNode );
	}


	exports.token = token;
	exports.listsKey = listsKey;

	exports.ajaxGet = ajaxGet;
	exports.ajaxPost = ajaxPost;

	exports.showTip = showTip;
	exports.switchNode = switchNode;
	exports.isDomCached = isDomCached;
	exports.isStorageCached = isStorageCached;
	exports.allMityOp = allMityOp;

	exports.cacaheToLocal = cacaheToLocal;
	exports.writeIntoChangeList = writeIntoChangeList;
	exports.addObjToLocal = addObjToLocal;
	exports.removeFromLocal = removeFromLocal;
	exports.changeStorageValueByKey = changeStorageValueByKey;


						

	function localLogin(){
		var usernameInput = document.querySelector('username');
		var passwordInput = document.querySelector('password');
		var loginBtn = document.querySelector('login-btn');
		this.Event.removeHandler(loginBtn,'click');
		this.Event.addHandler( loginBtn, 'click', function(){
			if( usernameInput && window.localStorage[ usernameInput.value ] ){
				if( Util.md5(  usernameInput.value.split('@')[0] + pwdInput.value +usernameInput.value.split('@')[0] ) ===  window.localStorage[ usernameInput.value ]){
					//授权成功
					console.log('授权成功！');
				}
			}
			else{
				alert('用户名错误！');
			}
		})
	}
});