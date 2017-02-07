var _ = require('underscore');
var Proto = {
	id 		 : 0,
	name 	 : null,
	title 	 : "",
	synopsis : "",
	image 	 : "",
	pages	 : null,
	tests 	 : null
};

/**
 *
 * @returns {{title: string}}
 */
module.exports = (defaults)=>{
	var model = Object.assign({}, Proto);
	model = _.defaults(model, defaults);
	model.pages = [];
	model.tests = [];
	model.id = _.uniqueId("lecture_");
	return model;
};