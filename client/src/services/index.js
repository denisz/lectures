var DataStore = require('./DataStore.js')
var Config = require('./Config.js');

module.exports = {
	DataStore 	: new DataStore(),
	Config 		: new Config()
};