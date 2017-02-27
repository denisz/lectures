var fetch 	   = require('./Fetch');
var Router 		= require('./Router');
var _ = require('underscore');

var Table = function () {
	this.items = [];
	this.users = {};
};

Table.prototype.map = function (iteratee) {
	return _.map(this.items, iteratee);
};


Table.prototype.count = function (iteratee) {
	return this.items;
};

Table.prototype.fetch = function (page, limit) {
	return fetch(Router.table(page, limit))
		.then((res)=>{
			this.items = res;
			var ids = _.uniq(_.pluck(res, "UserId"));
			var newIds = _.difference(ids, _.keys(this.users));

			if (newIds.length == 0 ) {
				return []
			}

			return fetch(Router.user(newIds))
		})
		.then((users)=>{
			console.log(users);
			var newUsers = _.object(_.pluck(users, "ID"), users);
			_.extend(this.users, newUsers);
		})
		.then(()=>{
			this.items = _.map(this.items, (i)=>{
				i.User = this.users[i.UserId];
				return i;
			})
		})
};


module.exports = Table;
