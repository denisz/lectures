module.exports = Object.assign({
	},
	{
		jsonMarshal: function (manifest) {
			_.extend(this, JSON.parse(manifest));
		}
	});