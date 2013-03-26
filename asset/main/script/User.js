define( function( require, exports, module){
	var Util = require( './Util' );
	var Conf = require( './Config' );

	var User = function( args ){
		this.username = args[0];
		this.password = args[1];
		this.token = undefined;
	};

	User.prototype.login = function(){
		var param = {
			action  : 'login',
			username: this.username,
			password: this.password
		};
		function callBackLogin( data, status){
			console.log(data);
		}
		Util.ajaxPost( Conf.userUrl, param, callBackLogin);
	}

	User.prototype.registe = function(){

	}

	User.prototype.logout = function(){

	}
	module.exports =  {
		init: function() {
			return new User( arguments );
		}
	};

	// module.exports = User;
})
