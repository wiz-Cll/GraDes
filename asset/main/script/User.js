define( function( require, exports, module){
	var Util = require( './Util' );
	var Seed = require( './Seed' );
	var Conf = require( './Config' );
	var Valid = require('./Valid');

	var User = function( args ){
		this.username = args[0];
		this.password = args[1];
		this.token = undefined;
	};

	User.prototype.login = function( callback ){
		var param = {
			action  : 'login',
			username: this.username,
			password: this.password
		};
		Seed.ajaxPost( Conf.userUrl, param, callback);
	};

	User.prototype.signup = function(){
		var param = {
			action  : 'signup',
			username: this.username,
			password: this.password
		};
		function callBackSignup( data, status){
			console.log(data);
		}
		Seed.ajaxPost( Conf.userUrl, param, callBackSignup);
	};

	User.prototype.logout = function(){
		var param = {
			action  : 'logout',
			token: this.token
		};
		function callBackLogout( data, status){
			console.log(data);
		}
		Seed.ajaxPost( Conf.userUrl, param, callBackLogout);
	};

	User.prototype.getUserName = function(){
		var param = {
			action  : 'getusername',
			user_id: user_id,
			token: this.token
		};
		function callBackGetUserName( data, status){
			console.log(data);
		}
		Seed.ajaxPost( Conf.userUrl, param, callBackGetUserName);
	};


	User.prototype.changePass = function( arg ){
		var param = {
			action  : 'logout',
			token: this.token,
			old_password: this.password,
			new_password: arg
		};
		function callBackChangePass( data, status){
			console.log(data);
		}
		Seed.ajaxPost( Conf.userUrl, param, callBackChangePass);
	};


	module.exports =  {
		init: function() {
			// v for validation
			var unV = Valid.userName( arguments[0] );
			var pwdV = Valid.pwd( arguments[1] );
			if( unV.von ){
				if( pwdV.von ){
					return new User( arguments );
				}
				else{
					Seed.showTip( pwdV.tip );
				}
			}
			else{
				Seed.showTip( unV.tip );
			}
			return false;
		}
	};

	// module.exports = User;
});
