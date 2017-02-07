var _ = require('underscore');

var proto = {
	id 		: 0,
	name 	: null,
	path 	: null,
	format 	: null
};

module.exports = (defaults)=>{
	var model = Object.assign({}, proto);
	model = _.defaults(model, defaults);
	model.id = _.uniqueId("page_");
	return model;
};