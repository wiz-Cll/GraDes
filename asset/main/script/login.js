define(function( require ){
	var Util = require('./Util');
	var User = require('./User');
	var Seed = require('./Seed');

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
		var formCtn = Util.qs('.formctn')

		Util.Event.addHandler( Util.qs('#login-btn') ,'click', function(){
			// Util.show( loading );
			var userEntity = User.init( usernameInput.value, pwdInput.value );
			var encriptedPass = Util.md5( pwdInput.value );
			if( userEntity === false ){
				// 说明未通过验证 没有生成用户实例
				return false;
			}
			else{

				Seed.allMityOp( userEntity.login, localOauth, callBackLogin, true );

				userEntity.login( callBackLogin );
				function localOauth( callBackLogin ){
					// console.log()
				};
				function callBackLogin( data, status ){
					if( data.error_code === 0){
						// 将验证通过的用户名和密码存储在localStorage
						var encriptedPass = Util.md5( usernameInput.value.split('@')[0] + pwdInput.value +usernameInput.value.split('@')[0]);
						Seed.cacaheToLocal( usernameInput.value, encriptedPass);

						// 动画切换
						login.className += ' loginani';
						userinfo.className += ' infoani';
						setTimeout(function() {
							userinfo.style.display="block";
							login.style.display= "none";
							// login.classList.remove('loginani');
							// userinfo.classlist.remove('infoani');
							//将获取的token存贮在本地
							window.localStorage['token'] = data.token;
							setTimeout(function(){
								location.href= './app.html';
							},1500);
						},aniTime);

						var welcome = Util.qs('.welcome');
						welcome.innerHTML = 'welcome you, ' + usernameInput.value.split('@')[0];

					}
					else{
						var errMsg = Util.errMap[ data.error_code ] || '未知错误';
						Seed.showTip( errMsg );
						return false;
					}
				}
			}
		});

		Util.Event.addHandler( Util.qs('#register-btn') ,'click', function(){
			var regName = Util.qs('#reg-username').value;
			var regPass = Util.qs('#reg-password').value;
			var confirmPass = Util.qs('#reg-confirm-password').value;
			if( regPass === confirmPass &&  regPass !== '' ){
				var userEntity =  User.init(regName, regPass );
				if( userEntity ){
					userEntity.signup();
				}
				else{
					return false;
				}
			}
			else{
				Seed.showTip('两个密码不同，请检查后重试');
			}
		});

		Util.Event.addHandler( Util.qs('#to-register') ,'click', function( e ){
			Util.addClass( formCtn, 'reg');
			Util.Event.preventDefault( e );
			return false;
		});
		Util.Event.addHandler( Util.qs('#to-login') ,'click', function( e ){
			Util.removeClass( formCtn, 'reg');
			Util.Event.preventDefault( e );
			return false;
		});
	};

});

