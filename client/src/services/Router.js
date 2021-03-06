var NewURLRequest = require('./URLRequest');
var _ = require('underscore');

module.exports = {
	register : (provider, accessToken, socialId, displayName, picture) => {
		var req = NewURLRequest();

		req.setPath("/social");
		req.setBody('provider', provider);
		req.setBody('accessToken', accessToken);
		req.setBody('socialId', socialId);
		req.setBody('displayName', displayName);
		req.setBody('picture', picture);

		return req
	},

	save : () => {
		var req = NewURLRequest();
		req.setPath("/social");

		return req
	},

	access : (user, pass) => {
		var req = NewURLRequest();
		req.setPath("/access");
		req.setBody("user", user);
		req.setBody("pass", pass);

		return req
	},

	logout : ()=>{
		var req = NewURLRequest();
		req.setPath("/logout");

		return req
	},

	result : (data)=>{
		var req = NewURLRequest();
		req.setPath("/result");
		req.setEncode("json");
		req.setBody(data);
		return req
	},

	results : (page, limit)=>{
		var req = NewURLRequest();
		req.setPath("/results");
		return req
	},

	users : (page, limit)=>{
		var req = NewURLRequest();
		req.setPath("/results");
		return req
	},

	table : (page, limit)=>{
		var req = NewURLRequest();
		req.setPath("/table");
		return req
	},

	who : ()=>{
		var req = NewURLRequest();
		req.setPath("/who");
		return req
	},

	user : (ids)=>{
		if (!_.isArray(ids)) {
			ids = [ids];
		}

		var req = NewURLRequest();
		req.setPath("/user");
		req.setBody("id", ids.join(","));
		return req
	},

	updater : ()=>{
		var req = NewURLRequest();
		req.setPath("/updater");
		return req
	},

	exportBy : (format) => {
		format = format || "xlsx";

		var req = NewURLRequest();
		req.setMethod("GET");
		req.setPath("/export");
		req.setBody("format", format);
		return req
	},

	lecture : () => {
		var req = NewURLRequest();
		req.setPath("/data");
		return req
	}
};
