define(function( require, exports, module){
	function qs( param ){
		return document.querySelector( param );
	}
	function qsa( param ){
		return document.querySelectorAll( param );
	}


	function addEvent(){

	}


	function ajaxGet( url, param, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 && status == 200){
				callBack();
			}
		}
		xhr.send( param );

	}
	function ajaxPost( url, param, callBack ){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 && status == 200){
				callBack();
			}
		}
		xhr.send( param );
	}



	// 暴露单个接口
	exports.qs = qs;
	exports.qsa = qsa;
	exports.ajaxGet = ajaxGet;
	exports.ajaxPost = ajaxPost;
	
	// 打包暴露接口 ?how?
	// modual.exports = qsa;
})
