var _ = require('underscore');
var proto = {
	items : []
};

module.exports = (defaults)=>{
	var model = Object.assign({}, proto);
	model = _.defaults(model, defaults, _.uniqueId("test_"));
	model.items = [];
	return model;
};