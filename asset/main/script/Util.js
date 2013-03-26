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
	                case 4: return 1;
	            }
	        }
	    },
	    
	    getCharCode: function(event){
	        if (typeof event.charCode == "number"){
	            return event.charCode;
	        } else {
	            return event.keyCode;
	        }
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
	    }

	};


	function ajaxGet( url, param, callBack){
		var xhr = new XMLHttpRequest();
		url = montageUrl( url , param);
		xhr.open('GET', url);
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 && xhr.status == 200){
				callBack();
			}
		}
		xhr.send( null );

	}
	function ajaxPost( url, param, callBack ){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		// xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');  
		// 这样设置header不正确
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 && xhr.status == 200){
				callBack();
			}
		}
		var paramStr = '';
		for( var i in param){
			paramStr += i+'='+ param[i]+'&' ;
		}
		paramStr = paramStr.substr(0, paramStr.length - 1)
		xhr.send( paramStr );
	}

	function showTip( str ){
		// 用户提示与反馈
		// 优雅降级的iOS提示
		// 高度的一致性
		console.log( str );
	}

	function ajaxFail( statusCode ){
		var state = '请求出错，原因是：。。。';
		switch( statusCode ){
			// case ''
		}
		showTip( state );
	}




	// 暴露单个接口
	exports.qs = qs;
	exports.qsa = qsa;
	exports.ajaxGet = ajaxGet;
	exports.ajaxPost = ajaxPost;
	exports.tip = showTip;
	exports.Event = Event;
	
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
})
