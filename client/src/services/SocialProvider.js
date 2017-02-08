var {ipcRenderer} = require('electron');
var _ = require('underscore');

function login (event) {
	var callback = event + _.uniqueId();
	ipcRenderer.send(event, callback);

	return new Promise((resolve, reject)=>{
		ipcRenderer.on(callback, (event, user)=>{
			if (user == false) {
				reject()
			} else {
				resolve(user)
			}
		});
	})
}

module.exports = {
	facebookLogin () {
		return login('app-facebook-login');
	},
	twitterLogin () {
		return login('app-twitter-login');
	},
	vkontakteLogin () {
		return login('app-vkontakte-login');
	}
};