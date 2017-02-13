var _ = require('underscore');
var Proto = {
	path 	: "",
	format 	: ""
};

/**
 *
 * @returns {{title: string}}
 */
module.exports = (defaults)=>{
	var model = Object.assign({}, Proto);
	model = _.defaults(model, defaults, {id : _.uniqueId("item_")});
	return model;
};