var _ = require('underscore');
var Proto = {
	name 	 : null,
	title 	 : "",
	synopsis : "",
	image 	 : "",
	pages	 : null,
	test 	 : null
};

/**
 *
 * @returns {{title: string}}
 */
module.exports = (defaults)=>{
	var model = Object.assign({}, Proto);
	model = _.defaults(model, defaults, {id: _.uniqueId("lecture_")});
	model.pages = [];
	model.test = null;
	return model;
};