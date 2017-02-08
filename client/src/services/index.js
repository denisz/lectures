var DataStore = require('./DataStore.js');
var Config = require('./Config.js');
var User = require('./User.js');

module.exports = {
	DataStore 		: new DataStore(),
	Config 			: new Config(),
	User 			: User
};