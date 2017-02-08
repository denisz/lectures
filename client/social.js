var FB = require('fb');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var twitterAPI = require('node-twitter-api');
var {BrowserWindow} = require('electron');
var _ = require('underscore');
var url = require('url');
var qs = require('querystring');
var http = require('https');

module.exports = {
	'app-facebook-login' : (event, callback)=>{
		var options = {
			client_id	: '368451330207620',
			scopes 		: "public_profile",
			redirect_uri: "https://www.facebook.com/connect/login_success.html"
		};
		var authWindow = new BrowserWindow({ width: 600, height: 540, show: false, webPreferences: { nodeIntegration: false, webSecurity: false, plugins: true}});

		var facebookAuthURL = "https://www.facebook.com/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
		authWindow.loadURL(facebookAuthURL);
		authWindow.show();

		function handleCallback(url) {
			var raw_code = /access_token=([^&]*)/.exec(url) || null;
			var access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
			var error = /\?error=(.+)$/.exec(url);

			if(access_token) {
				FB.setAccessToken(access_token);
				FB.api('/me', { fields: ['id', 'name', 'picture.width(800).height(800)'] }, function (res) {
					event.sender.send(callback, {
						name 		: res.name,
						socialId 	: res.id,
						token 		: access_token,
						provider 	: "fb",
						picture 	: res.picture.data.url
					});
					authWindow.close();
				});
			} else {
				console.log(error);
				event.sender.send(callback, false);
				authWindow.close();
			}
		}

		authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
			handleCallback(newUrl);
		});

		authWindow.webContents.on('will-navigate', function (event, url) {
			handleCallback(url);
		});
	},
	'app-twitter-login' : (event, callback)=>{
		var twitter = new twitterAPI({
			consumerKey: 'VIJDa37l82sS86CWfEMYEbnC0',
			consumerSecret: 'HBigr32e7yN1gDi792XNR8Qufdxrz4LUpMl0UpDhwwBNdcLwxt',
			requestToken: '',
			callback: 'http://example/callback'
		});

		var oAuthRequestToken;
		var oAuthRequestTokenSecret;

		twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
			if (error) {
				console.log("Error occured while fetching oAuth Request Token..");
				event.sender.send(callback, false);
			}
			else {
				oAuthRequestToken = requestToken;
				oAuthRequestTokenSecret = requestTokenSecret;
				eventEmitter.emit('got-request-token');
			}
		});
		eventEmitter.on("got-request-token", function () {
			var twitterAuthURL = "https://twitter.com/oauth/authenticate?oauth_token="+ oAuthRequestToken;
			var authWindow = new BrowserWindow({ width: 700, height: 480, show: false, webPreferences: { nodeIntegration: false, webSecurity: false, plugins: true} });
			authWindow.loadURL(twitterAuthURL);
			authWindow.show();

			authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
				handleCallback(newUrl)
			});

			authWindow.webContents.on('will-navigate', function (event, url) {
				handleCallback(url);
			});

			function handleCallback(newUrl) {
				var query  = url.parse(newUrl).query;
				var oAuthVerifier = _.property('oauth_verifier')(qs.parse(query));

				twitter.getAccessToken(oAuthRequestToken, oAuthRequestTokenSecret, oAuthVerifier, function(error, accessToken, accessTokenSecret, results) {
					if (error) {
						event.sender.send(callback, false);
						authWindow.close();
					} else {
						twitter.verifyCredentials(accessToken, accessTokenSecret, {}, function(error, data, response) {
							if (error) {
								event.sender.send(callback, false);
								authWindow.close();
							} else {
								event.sender.send(callback, {
									name 		: data["screen_name"],
									socialId 	: data["id"],
									token 		: accessToken,
									tokenSecret : accessTokenSecret,
									provider 	: "tw",
									picture 	: data["profile_image_url_https"]
								});
								authWindow.close();
							}
						});
					}
				});
			}
		});
	},
	'app-vkontakte-login' : (event, callback)=>{
		var redirectUri = 'https://oauth.vk.com/blank.html';
		var client_id = "5498445";
		let authWindow = null;

		let token = null;

		authWindow = new BrowserWindow({
			width:          600,
			height:         400,
			type:           'splash',
			webPreferences: { nodeIntegration: false, webSecurity: false, plugins: true}
		});

		authWindow.on('closed', function () {
			authWindow = null;
		});

		authWindow.webContents.on('new-window', function (e, url) {
			e.preventDefault();
			shell.openExternal(url);
		});

		authWindow.webContents.on('did-get-redirect-request', function (e, oldUrl, newUrl) {
			if (newUrl.indexOf(redirectUri) !== 0) return;
			var hash  = url.parse(newUrl).hash.substr(1);
			token = _.property('access_token')(qs.parse(hash));
			var profileUrl = `https://api.vk.com/method/users.get?access_token=${token}&fields=photo_big`;
			http.get(profileUrl, (response) => {
					let buffer = '';
					response.on('data', chunk => buffer += chunk.toString());
					response.on('end', function () {
						try {
							const data = JSON.parse(buffer);
							const user = data.response[ 0 ];

							event.sender.send(callback, {
								name 		: user.first_name + " " + user.last_name,
								socialId 	: user.uid,
								token 		: token,
								provider 	: "vk",
								picture 	: user.photo_big
							});
						} catch (e) {
							event.sender.send(callback, false);
						}

						authWindow.close();
					});
				})
				.on('error', (e) => {
					event.sender.send(callback, false);
					authWindow.close();
				});
		});

		authWindow.loadURL(url.format({
			protocol: 'https',
			host:     'oauth.vk.com',
			pathname: 'authorize',
			query:    {
				client_id:     client_id,
				scope:         [ '' ].join(','),
				redirect_uri:  redirectUri,
				display:       'popup',
				v:             '5.41',
				response_type: 'token'
			}
		}));
	}
};