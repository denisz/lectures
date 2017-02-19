var Session = function () {
	this.id = null;
};

Session.prototype.sessionID = function () {
	return this.id;
};

Session.currentSession = null;

Session.setCurrentSession = function (session) {
	Session.currentSession = session;
};

module.exports = Session;