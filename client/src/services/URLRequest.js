var Session = require('./Session');
var join = require('url-join');
var _ = require('underscore');

var URLRequest = function (url) {
	this._baseUrl = url || URLRequest.baseURL;
	this._headers = {};
	this._method = "POST";
	this._body = {};
	this._encode = "urlencoded";
};

URLRequest.baseURL = "http://localhost:8083";

var proto = URLRequest.prototype;

proto.absoluteString = function () {
	return join(this._baseUrl, this._path);
};

proto.setPath = function (path) {
	this._path = path;
	return this;
};

proto.method = function () {
	return this._method;
};

proto.setEncode = function (type) {
	this._encode = type;
	return this;
};

proto.body = function () {
	var params = this._body;

	switch(this._encode) {
		case 'json':
			return JSON.stringify(params);
		case 'urlencoded':
			return Object.keys(params).map((key) => {
				return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
			}).join('&');
	}
};

proto.headers = function () {
	switch(this._encode) {
		case 'json':
			this._headers['Content-Type'] = 'application/json';
			break;
		case 'urlencoded':
			this._headers['Content-Type'] = 'application/x-www-form-urlencoded';
			break;
	}

	return this._headers;
};

proto.setBody = function (key, value) {
	if (_.isObject(key)) {
		this._body = _.extend({}, this._body, key);
		return;
	}

	this._body[key] = value;
	return this;
};

proto.setHeader = function (key, value) {
	this._headers[key] = value;
	return this;
};

module.exports = function (url) {
	var req = new URLRequest(url);
	var session = Session.currentSession;
	if (session) {
		req.setHeader("Application-Session-ID", session.sessionID());
	}
	return req;
};