define(function( require ){
	var Util = require('./Util');
	// var Conf = require('./Config');
	var User = require('./User');

	window.onload = function(){
		console.log('module was require suc by seajs');
		// console.log( util.qs('.login').innerText );
		// console.log( util.qsa('input') );

		// 多添加HTML5特性   如多类  不要在乎兼容性了！！
		var aniTime = 400;
		var login = Util.qs('.login');
		var userinfo = Util.qs(".userinfo");
		var params = new Array();

		Util.Event.addHandler( Util.qs('.btn') ,'click', function(){
			// 获取用户输入的方法
			var currentUser = new User.init('chenllos@163.com','sasuke');
			currentUser.login();
			// console.log('添加loginani类   '+ (new Date()).valueOf())
			login.className += ' loginani';
			// console.log('添加loginani类完成，开始添加userinfoani类   '+ (new Date()).valueOf())
			userinfo.className += ' infoani';
			// console.log('添加infoani类完成类   '+ (new Date()).valueOf())
			// console.log(userinfo.innerText);
			setTimeout(function() {
				// console.log('执行display赋值操作   '+ (new Date()).valueOf())
				userinfo.style.display="block";
				login.style.display= "none";
				// login.classList.remove('loginani');
				// userinfo.classlist.remove('infoani');
			},aniTime);
 		});
		
	};

})

