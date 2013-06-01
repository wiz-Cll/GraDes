define(function( require, exports){
	var Util = require('./Util');
	var Seed = require('./Seed');
	var User = require('./User');
	var List = require('./List');
	var Todo = require('./Todo');
	var UI = require('./UI');

	window.onload = function(){
		UI.init();
		List.bind();
		List.getLists( Seed.token, true );

		Todo.bind();
	};
});