var DataStore 	= require('./DataStore.js');
var Config 		= require('./Config.js');
var User 		= require('./User.js');
var URLRequest 	= require('./URLRequest.js');
var Session 	= require('./Session.js');

module.exports = {
	DataStore 		: new DataStore(),
	Config 			: new Config(),
	User 			: User,
	Session 		: Session,
	URLRequest 		: URLRequest
};