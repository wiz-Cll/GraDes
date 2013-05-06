define( function( require, exports, module){
	var Util = require('./Util');
	function initUI(){
		var aside = Util.qs('aside');
		var section = Util.qs('section');
		console.log( aside.innerText );
		console.log( section.innerText );
		section.style.marginLeft = aside.style.width;
	}

	exports.init = initUI;
})