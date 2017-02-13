var _ = require('underscore');

var proto = {
	name 	: null,
	path 	: null,
	format 	: null
};

module.exports = (defaults)=>{
	var model = Object.assign({}, proto);
	model = _.defaults(model, defaults, {id: _.uniqueId("page_")});
	return model;
};