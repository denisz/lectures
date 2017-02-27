const {BrowserWindow} = require('electron');
const {download} = require('electron-dl');

var Download = function () {};

Download.prototype.router = function () {
	return {
		"app-download-documents" : (event, args) => {
			download(BrowserWindow.getFocusedWindow(), args.url)
				.then(dl => console.log(dl.getSavePath()))
				.catch(console.error);
		}
	}
};

module.exports = Download;

