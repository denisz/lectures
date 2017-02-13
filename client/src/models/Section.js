var _ = require('underscore');

var proto = {
	name  	 : null,
	lectures : null,
};

module.exports = (defaults)=>{
	var model = Object.assign({}, proto);
	model = _.defaults(model, defaults, {id : _.uniqueId("section_")});
	model.lectures = [];
	return model;
};