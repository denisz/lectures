var {ipcRenderer} = require('electron');
var services = require('./services');

module.exports = function () {
	var config 		= ipcRenderer.sendSync('app-storage-manifest');
	var documents 	= ipcRenderer.sendSync('app-storage-documents');

	services.DataStore.loadData(documents);
	services.Config.loadData(config);
};

