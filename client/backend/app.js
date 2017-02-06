var {app, ipcMain} = require('electron');
var _ = require('underscore');

app.use = function (router) {
	if (_.isObject(router)) {
		for (var i in router) {
			if (router.hasOwnProperty(i)) {
				ipcMain.on(i, router[i])
			}
		}
	}
};

ipcMain.on("brain", function (event, args) {
	console.log("args", args);
	event.returnValue = {
		x: 1
	}
});

module.exports = app;