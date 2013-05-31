define(function( require ){
	var Util = require('./Util');
	var User = require('./User');

	window.onload = function(){
		console.log('module was require suc by seajs');

		// 多添加HTML5特性   如多类  不要在乎兼容性了！！
		var aniTime = 400;
		var login = Util.qs('.login');
		var userinfo = Util.qs(".userinfo");

		var usernameInput = Util.qs('#username');
		var pwdInput = Util.qs('#password');
		var loading = Util.qs('.loading');
		var params = new Array();

		Util.Event.addHandler( Util.qs('.btn') ,'click', function(){
			Util.show( loading );
			var userEntity = User.init( usernameInput.value, pwdInput.value );
			if( userEntity === false ){
				// 说明未通过验证 没有生成用户实例
				return false;
			}
			else{
				userEntity.login( callBackLogin );
				function callBackLogin( data, status){
					if( data.error_code === 0){
						login.className += ' loginani';
						userinfo.className += ' infoani';
						setTimeout(function() {
							userinfo.style.display="block";
							login.style.display= "none";
							// login.classList.remove('loginani');
							// userinfo.classlist.remove('infoani');
						},aniTime);
					}
					else{
						console.log( data.message);
					}
				}
			}
		});

	};

});

