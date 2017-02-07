var path = require('path');
var fs = require('fs');

var Storage = function () {};

Storage.prototype.loadWithPath = function (path) {
	return new Promise((resolve, reject)=>{
		resolve()
	});
};

Storage.prototype.router = function () {
	return {

	}
};

module.exports = Storage;