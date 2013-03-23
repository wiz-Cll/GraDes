define(function( require ){
	var util = require('./Util');
	var conf = require('./config');

	window.onload = function(){
		console.log('module was require suc by seajs');
		// console.log( util.qs('.login').innerText );
		// console.log( util.qsa('input') );

		// 多添加HTML5特性   如多类  不要在乎兼容性了！！
		var aniTime = 400;
		var login = util.qs('.login');
		var userinfo = util.qs(".userinfo");
		var params = new Array();

		util.qs('.btn').onclick = function() {
			var param = {
				email: 'chenllos@163.com',
				password: 'sasuke'
			}
			util.ajaxPost( conf.signUpUrl, param, function(){
				console.log('返回成功接收');
			} );
			console.log('添加loginani类   '+ (new Date()).valueOf())
			login.className += ' loginani';
			console.log('添加loginani类完成，开始添加userinfoani类   '+ (new Date()).valueOf())
			userinfo.className += ' infoani';
			console.log('添加infoani类完成类   '+ (new Date()).valueOf())
			// console.log(userinfo.innerText);
			setTimeout(function() {
				console.log('执行display赋值操作   '+ (new Date()).valueOf())
				userinfo.style.display="block";
				login.style.display= "none";
				// login.classList.remove('loginani');
				// userinfo.classlist.remove('infoani');
			},aniTime);
		};



		// var aniTime = 800;
		// var login = document.getElementsByClassName('login')[0];
		// var userinfo = document.getElementsByClassName("userinfo")[0];
		// var params = new Array();
		// params = [login, userinfo];

		// document.getElementsByClassName('btn')[0].onclick = function() {
		// 	login.className =login.className+' '+'loginani';
		// 	userinfo.className = 'infoani';
		// 	console.log(userinfo.innerText);
		// 	setTimeout(function() {
		// 		userinfo.style.display="block";
		// 		login.style.display= "none";
		// 		// login.classList.remove('loginani');
		// 		// userinfo.classlist.remove('infoani');
		// 	},aniTime);
		// };



	}

	var User = function(){
		this.username = arguments[0];
		this.password = arguments[1];
		this.login = function(){
			var requestParam = {
				'username': this.username,
				'password': this.password
			}
			var xhr = new XMLHttpRequest();
			xhr.open('post', login_url, true);
			xhr.send( data );
		}
	}

})

