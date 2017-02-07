var _ = require('underscore');

/**
 *
 * @param promises
 * @returns {Promise}
 */
module.exports = (promises) => {
	return new Promise((resolve, reject)=>{
		var keys 	= _.keys(promises);
		var results = _.object(_.map(keys, (i)=>[i]));
		var counter = 0;
		var end 	= _.size(keys);

		var setter = function (key, state, value) {
			results[key] = {state: state, value : value};
			counter++;

			if (counter === end) {
				resolve(results);
			}
		};

		for (var i = 0, l = keys.length ; i < l; i++) {
			promises[keys[i]].then(
				_.bind(setter, this, keys[i], 'fulfilled'),
				_.bind(setter, this, keys[i], 'rejected')
			)
		}
	})
};