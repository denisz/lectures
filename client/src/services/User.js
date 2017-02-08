var current  = null;
var _ = require('underscore');
var SocialProvider = require('./SocialProvider.js');

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
};

User.prototype.save = function () {
	return new Promise((resolve, reject)=>{
		var key = "user_"  + this.socialId;
		localStorage.setItem(key, JSON.stringify({
			name 		: this.name,
			picture 	: this.picture,
			socialId 	: this.socialId,
			id  		: this.id,
			provider    : this.provider
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

		current.name 	 = user.name;
		current.picture  = user.picture;
		current.socialId = user.socialId;
		current.provider = user.provider;

		resolve(current);
	})
};

User.loginWithFacebook = function () {
	return new Promise((resolve, reject)=>{
		SocialProvider.facebookLogin()
			.then((user)=>{
				return User.setCurrent(user);
			})
			.then((user)=>{
				return user.save();
			})
			.then(resolve, reject)
	})
};

User.loginWithVkontakte = function () {
	return new Promise((resolve, reject)=>{
		SocialProvider.vkontakteLogin()
			.then((user)=>{
				return User.setCurrent(user);
			})
			.then((user)=>{
				return user.save();
			})
			.then(resolve, reject)
	})
};

User.loginWithTwitter = function (t) {
	return new Promise((resolve, reject)=>{
		SocialProvider.twitterLogin()
			.then((user)=>{
				return User.setCurrent(user);
			})
			.then((user)=>{
				return user.save();
			})
			.then(resolve, reject)
	})
};

module.exports = User;