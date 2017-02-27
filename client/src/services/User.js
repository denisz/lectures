var current  		= null;
var _ 				= require('underscore');
var SocialProvider 	= require('./SocialProvider.js');
var Router 			= require('./Router');
var fetch 			= require('./Fetch');
var Session 		= require('./Session');

function savedIdUsers () {
	var ids = localStorage.getItem("saved") || "";
	return _.compact(ids.split(","))
}

var User = function () {
	this.name 	 	= null;
	this.picture 	= null;
	this.socialId 	= null;
	this.id 		= null;
	this.provider   = null;
	this.sessionID  = null;
	this.admin 		= false;
};

User.prototype.save = function () {
	return new Promise((resolve, reject)=>{
		var key = "user_"  + this.socialId;
		localStorage.setItem(key, JSON.stringify({
			name 		: this.name,
			picture 	: this.picture,
			socialId 	: this.socialId,
			id  		: this.id,
			provider    : this.provider,
			sessionID   : this.sessionID,
			admin 		: this.admin
		}));

		var users = _.union(savedIdUsers(), [key]);
		localStorage.setItem("saved", users);

		resolve(this);
	});
};

User.logout = function () {
	current = null;
};

User.current = function () {
	return current;
};

User.savedUsers = function () {
	var ids = savedIdUsers();
	return _.map(ids, (i)=>{
		return JSON.parse(localStorage.getItem(i))
	})
};

User.setCurrent = function (user) {
	return new Promise((resolve, reject)=>{
		current = new User();

		current.id 		  = user.id;
		current.name 	  = user.name;
		current.picture   = user.picture;
		current.socialId  = user.socialId;
		current.provider  = user.provider;
		current.admin 	  = user.admin;
		current.sessionID = user.sessionID;

		console.log("user:", user);
		resolve(current);
	})
};

User.resolveWithServer = function (user) {
	var request = Router.register(
		  user.provider
		, user.token
		, user.socialId
		, user.name
		, user.picture);

	return fetch(request)
		.then((res)=>{
			console.log(user);
			if (res.Session) {
				User.SetCurrentSessionId(res.Session.ID);
				user.sessionID 	= res.Session.ID;
			}
			user.id 		= res.User.ID;
			user.admin 		= res.User.Admin;

			return user;
		})
};

User.SetCurrentSessionId = function (id) {
	var clientSession = new Session();
	clientSession.id  = id;
	Session.setCurrentSession(clientSession);
};

User.saveUser = function (user) {
	return user.save();
};

User.loginWithLocal = function (user) {
	User.SetCurrentSessionId(user.sessionID);
	return User.setCurrent(user);
};

User.loginWithFacebook = function () {
	return new Promise((resolve, reject)=>{
		SocialProvider.facebookLogin()
			.then(User.resolveWithServer)
			.then(User.setCurrent)
			.then(User.saveUser)
			.then(resolve, reject)
	})
};

User.loginWithVkontakte = function () {
	return new Promise((resolve, reject)=>{
		SocialProvider.vkontakteLogin()
			.then(User.resolveWithServer)
			.then(User.setCurrent)
			.then(User.saveUser)
			.then(resolve, reject)
	})
};

User.loginWithTwitter = function (t) {
	return new Promise((resolve, reject)=>{
		SocialProvider.twitterLogin()
			.then(User.resolveWithServer)
			.then(User.setCurrent)
			.then(User.saveUser)
			.then(resolve, reject)
	})
};

module.exports = User;