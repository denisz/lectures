var _ = require('underscore');

module.exports = Object.assign({
		title 	 : "",
		synopsis : "",
		image 	 : "",
		pages	 : [],
		tests 	 : []
	},
	{
		jsonMarshal: function (manifest) {
			_.extend(this, JSON.parse(manifest));
		}
	});