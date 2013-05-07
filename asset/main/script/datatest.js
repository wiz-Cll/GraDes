define(function( require, exports){
	var Util = require('./Util');
	var User = require('./User');
	var List = require('./List');

	var newTokenBtn = Util.qs('#btn-get-token');
	var newListBtn = Util.qs('#btn-new-list');
	var getListBtn = Util.qs('#btn-get-list');

	var showTokenInput = Util.qs('#input-show-token');
	var newListInput = Util.qs('#input-new-list');
	var showListUl = Util.qs('#ul-show-list');


	Util.Event.addHandler( newTokenBtn, 'click',function(){
		var userEntity = User.init( 'chenllos@163.com', 'sasuke' );
		userEntity.login( loginGetToken );

		function loginGetToken( data,status){
			if( data.error_code === 0){
				showTokenInput.value = data.token;
			}
			else{
				console.log('lgoin failed');
			}
			return false;
		}
	});

	Util.Event.addHandler( newListBtn, 'click',function(){
		var token = showTokenInput.value;
		var listName = newListInput.value;

		List.newList( listName, token, newListCallBack);

		function newListCallBack( data, status){
			if( data.error_code === 0){
				console.log( data.list_id );
			}
			else{
				console.log( 'new list failed' );
			}
			return false;
		}
	});

	Util.Event.addHandler( getListBtn, 'click',function(){
		// 又是越来越臃肿的主js文件
		// 有必要的话,把所有的请求的callback写在UI.js里面
		// ?
		// 因为所有的回调都是为了显示请求的结果,都是为了为用户反馈,都在UI上表现
		var token = showTokenInput.value;
		List.getLists( token, showAllLists);
		// 然后  如果错误错里高度统一的话就在util中把判断error_code的事情做掉
		function showAllLists( data, status ){
			if( !data.error_code ){
				console.log(data);
				var listsCount = data.lists.length;
				if( listsCount > 0){
					var listHtmlStr = '';

					for( var i = 0; i<listsCount; i++){
						listHtmlStr += '<li>';
						listItem = data.lists[i];
						for( var j in listItem){
							listHtmlStr += j+'-:-' + listItem[j] + '<br/>';
						}
						listHtmlStr += '</li>'
					}
					showListUl.innerHTML = listHtmlStr;
				}
				else{
					console.log('您还没有建立列表')
				}
			}
			else{
				console.log( 'get lists failed ');
			}
		}
	});

	// Util.Event.addHandler( newTokenBtn, 'click',function(){

	// });
})