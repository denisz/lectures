var fetch 	   = require('./Fetch');
var Router 		= require('./Router');
var _ = require('underscore');

var Users = function () {
	this.items = [];
};

Users.prototype.map = function (iteratee) {
	return _.map(this.items, iteratee);
};


Users.prototype.count = function (iteratee) {
	return this.items;
};

Users.prototype.fetch = function (page, limit) {
	return fetch(Router.users(page, limit))
		.then((res)=>{
			console.log(res);
			this.items = res;
		})
};


module.exports = Users;
