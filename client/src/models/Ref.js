var _ = require('underscore');

var proto = {
	html 	: "",
	format : ""
};

module.exports = (defaults)=>{
	var model = Object.assign({}, proto);
	model = _.defaults(model, defaults, {id: _.uniqueId("ref_")});
	model.lectures = [];
	return model;
};