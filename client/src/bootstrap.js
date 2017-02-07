var {ipcRenderer} = require('electron');
module.exports = function () {
	var config 		= ipcRenderer.sendSync('app-storage-manifest');
	var documents 	= ipcRenderer.sendSync('app-storage-documents');


};

