define(function( require, exports){
	var Util = require('./Util');
	var User = require('./User');
	var List = require('./List');
	var Todo = require('./Todo');
	var UI = require('./UI');

	window.onload = function(){
		UI.init();
		// List.bind();
		// List.getLists( Util.token );

		// Todo.bind();
	}
})