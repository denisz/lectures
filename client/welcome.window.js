var {BrowserWindow} = require('electron');

module.exports = function () {
	let welcome = new BrowserWindow({
		show: false,
		width: 500,
		height: 300,
		frame: false,
		center : true,
		resizable : false,
		alwaysOnTop : true,
		backgroundColor : "#151D25",
		titleBarStyle: 'hidden'
	});
	welcome.loadURL('file://' + __dirname + '/dist/welcome.html');
	welcome.setIgnoreMouseEvents(true);
	welcome.webContents.on('did-finish-load', function () {
		setTimeout(function () {
			welcome.show();
			welcome.focus();
		}, 1000)
	});

	return welcome
};