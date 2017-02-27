var Router 	= require('./Router');
var fetch 	= require('./Fetch');
var _ 		= require('underscore');

var Result = function (data) {
	this.data 	 = _.defaults({}, data, {
		answers: []
	});
};

Result.prototype.push = function (answer) {
	this.data.answers.push(answer)
};

Result.prototype.toJSON = function () {
	return this.data;
};

Result.prototype.save = function () {
	return fetch(Router.result(this.toJSON()))

};


module.exports = Result;