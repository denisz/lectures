var path = require('path');
var fs = require('fs');
var RSVP = require('rsvp');
var _ = require('underscore');

var Storage = function () {};

Storage.prototype.loadWithPath = function (path) {
	var deferred = RSVP.defer("load path");

	deferred.resolve();
	return deferred.promise;
};

Storage.prototype.router = function () {
	return {

	}
};

module.exports = Storage;