var {ipcRenderer} = require('electron');
module.exports = function () {
	console.log(ipcRenderer.sendSync('brain', 'ping'));
};

