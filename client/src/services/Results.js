var fetch 	   = require('./Fetch');
var Router 		= require('./Router');
var _ = require('underscore');

var Results = function () {
	this.items = [];
};

Results.prototype.map = function (iteratee) {
	return _.map(this.items, iteratee);
};


Results.prototype.count = function (iteratee) {
	return this.items;
};

Results.prototype.fetch = function (page, limit) {
	return fetch(Router.results(page, limit))
		.then((res)=>{
			console.log(res);
			this.items = res;
		})
};


module.exports = Results;
