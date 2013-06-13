define( function(require, exports, module){
	var Util = require('./Util');
	var errMsg = {
		// 1100以下为用户名问题
		// 1100-1200为密码问题
		// 1200-1300为列表名问题
		// 1300-1400为事务问题
		1010: '用户名为空！',
		1015: '不是正确的邮箱',
		1020: '密码为空！',
		1025: '密码长度过短：至少6个字符'
	};

	function checkEmail( str ){
		return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str);
	}

	function validPass( str ){
		if( str.length < 6 ){
			return false;
		}
		else{
			return true;
		}
	}
	function userName( str ){
		var result = {
			von: false,
			tip: undefined
		};
		if( str ){
			if( checkEmail(str) ){
				result.von = true;
			}
			else{
				result.tip = errMsg[1015];
			}
		}
		else{
			result.tip = errMsg[1010];
		}

		return result;
	}

	function pwd( str ){
		var result = {
			von: false,
			tip: undefined
		};

		if( str ){
			if( validPass(str) ){
				result.von = true;
			}
			else{
				result.tip = errMsg[1025];
			}
		}
		else{
			result.tip = errMsg[1020];
		}

		return result;
	}

	exports.userName = userName;
	exports.pwd = pwd;
});