define(function( require, exports, module){
	function qs( param ){
		return document.querySelector( param );
	}
	function qsa( param ){
		return document.querySelectorAll( param );
	}

	var Event = {
		addHandler: function(element, type, handler){
		if (element.addEventListener){
				element.addEventListener(type, handler, false);
			} else if (element.attachEvent){
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
				}
			},

			getButton: function(event){
			if (document.implementation.hasFeature("MouseEvents", "2.0")){
				return event.button;
			} else {
				switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4: 
					return 1;
				}
			}
		},

		getCharCode: function(event){
			var code = event.which? event.which : event.keyCode;
			return code;
			// if (typeof event.charCode == "number"){
			//     return event.charCode;
			// } else {
			//     return event.keyCode;
			// }
			},

		getClipboardText: function(event){
			var clipboardData =  (event.clipboardData || window.clipboardData);
				return clipboardData.getData("text");
			},

		getEvent: function(event){
			return event ? event : window.event;
			},

		getRelatedTarget: function(event){
			if (event.relatedTarget){
				return event.relatedTarget;
			} else if (event.toElement){
				return event.toElement;
			} else if (event.fromElement){
				return event.fromElement;
			} else {
				return null;
			}
		},

		getTarget: function(event){
			return event.target || event.srcElement;
		},

		getWheelDelta: function(event){
			if (event.wheelDelta){
				return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
			} else {
				return -event.detail * 40;
			}
		},

		preventDefault: function(event){
			if (event.preventDefault){
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},

		removeHandler: function(element, type, handler){
			if (element.removeEventListener){
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent){
				element.detachEvent("on" + type, handler);
			} else {
				element["on" + type] = null;
			}
		},

		setClipboardText: function(event, value){
			if (event.clipboardData){
				event.clipboardData.setData("text/plain", value);
			} else if (window.clipboardData){
				window.clipboardData.setData("text", value);
			}
		},

		stopPropagation: function(event){
			if (event.stopPropagation){
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},

		trigger: function(element,event){
			if (document.createEventObject){
				// IE浏览器支持fireEvent方法
				var evt = document.createEventObject();
				return element.fireEvent('on'+event,evt);
			}
			else{
				// 其他标准浏览器使用dispatchEvent方法
				var evt = document.createEvent( 'HTMLEvents' );
				// initEvent接受3个参数：
				// 事件类型，是否冒泡，是否阻止浏览器的默认行为
				evt.initEvent(event, true, true);
				return !element.dispatchEvent(evt);
			}
		}

	};

	function hasClass(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}

	function addClass(obj, cls) {
		if(!this.hasClass(obj, cls)){
			if( obj.className === '' ){
				obj.className += cls;
			}
			else{
				obj.className += ' ' + cls;
			}
		}
	}

	function removeClass(obj, cls) {

		if (hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, '');
		}
	}

	function toggleClass(obj,cls){
		if(hasClass(obj,cls)){
			removeClass(obj, cls);
		}else{
			addClass(obj, cls);
		}
	}


	function ajaxGet( url, param, callBack){
		var xhr = new XMLHttpRequest();
		url = montageUrl( url , param);
		xhr.open('GET', url);
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 && xhr.status == 200){
				try{
					var data = parseObj( xhr.responseText );
					callBack( data );
				}
				catch(err){
					console.log('解析返回数据时发生错误：' + err);
				}
			}
		};
		xhr.send( null );

	}

	function ajaxPost( url, param, callBack ){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		// xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');  
		// 这样设置header不正确
		xhr.onreadystatechange = function(){
			if( xhr.readyState === 4 ){
				if( xhr.status === 200){
					try{
						// console.log( xhr.getResponseHeader('Content-Type') );

						var data = parseObj( xhr.responseText );
						callBack( data );
						// callBack( data );
					}
					catch(err){
						showTip('解析返回信息时发生错误： ' + err);
					}
				}
				else{

				}
			}
			else{

			}
		};
		var paramStr = '';
		for( var i in param){
			paramStr += i+'='+ param[i]+'&' ;
		}
		paramStr = paramStr.substr(0, paramStr.length - 1);
		xhr.send( paramStr );
	}


	function show( obj ){
		obj.style.display = 'block';
		return false;
	}
	function ajaxFail( statusCode ){
		var state = '请求出错，原因是：。。。';
		switch( statusCode ){
			// case ''
		}
		showTip( state );
	}


	var errMap = {
		1:	'未知错误',
		2:	'写入数据失败(Mongodb_Writter Filed)',
		3:	'用户名占用',
		4:	'提交数据为空',
		5:	'用户不存在',
		6:	'密码不正确',
		7:	'token无效或登录超时',
		8:	'注销失败',
		9:	'数据依赖关系不完整',
		10:	'指定列表不存在',
		11:	'下层有数据',
		12:	'不能将列表共享给自己',
		13:	'列表数量有误',
		14:	'该事务不存在',
		15:	'事务数量有误',
		16:	'笔记不存在'
	};


	// exports.token = token;
	// exports.listsKey = listsKey;
	// 暴露单个接口
	exports.qs = qs;
	exports.qsa = qsa;

	exports.addClass = addClass;
	exports.hasClass = hasClass;
	exports.removeClass = removeClass;
	exports.toggleClass = toggleClass;

	exports.ajaxGet = ajaxGet;
	exports.ajaxPost = ajaxPost;

	// exports.isDomCached = isDomCached;
	// exports.isStorageCached = isStorageCached;

	// exports.showTip = showTip;
	exports.show = show;

	exports.Event = Event;
	exports.errMap = errMap;

	// 打包暴露接口 ?how?
	// modual.exports = qsa;





	function montageUrl( url, param ){
		var requestUrl = url;
		var separator = '&';
		if( url.indexOf('?')  < 0){
			separator = '?';
		}

		for( var i in param){
			requestUrl += separator + i + '=' + param[i];
			separator = '&';
		}
		return requestUrl;
	}

	function parseObj( str ){
		var data;
		try{
			data = JSON.parse( str );
		}
		catch( err ){
			// console.log('使用parse解析返回数据时 出现错误····'+err);
			data = eval('(' + str +')');
		}
		return data;
	}
})
