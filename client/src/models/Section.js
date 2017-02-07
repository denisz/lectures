var _ = require('underscore');

var proto = {
	id 		 : 0,
	name  	 : null,
	lectures : null,
};

module.exports = (defaults)=>{
	var model = Object.assign({}, proto);
	model = _.defaults(model, defaults);
	model.lectures = [];
	model.id = _.uniqueId("section_");
	return model;
};