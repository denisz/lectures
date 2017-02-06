var {Menu, BrowserWindow} = require('electron');

module.exports = function () {
	// Create the browser window.
	var mainWindow = new BrowserWindow({
		show 			: false,
		width 			: 1024,
		height 			: 580,
		minHeight 		: 400,
		minWidth 		: 842,
		titleBarStyle 	: 'hidden'
	});

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/dist/app.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	mainWindow.webContents.on('did-finish-load', function () {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	if (process.env.NODE_ENV === 'development') {
		mainWindow.openDevTools();
		mainWindow.webContents.on('context-menu', (e, props) => {
			const { x, y } = props;

			Menu.buildFromTemplate([{
				label: 'Inspect element',
				click() {
					mainWindow.inspectElement(x, y);
				}
			}]).popup(mainWindow);
		});
	}

	if (process.platform === 'darwin') {
		var template = [{
			label: 'View',
			submenu: [{
				label: 'Reload',
				accelerator: 'Command+R',
				click() {
					mainWindow.webContents.reload();
				}
			}, {
				label: 'Toggle Developer Tools',
				accelerator: 'Alt+Command+I',
				click() {
					mainWindow.toggleDevTools();
				}
			}]
		}];

		if (process.env.NODE_ENV === 'development') {
			var menu = Menu.buildFromTemplate(template);
			mainWindow.setMenu(menu);
		}
	} else {
		var template = [{
			label: '&View',
			submenu: [{
				label: '&Reload',
				accelerator: 'Ctrl+R',
				click() {
					mainWindow.webContents.reload();
				}
			}, {
				label: 'Toggle &Developer Tools',
				accelerator: 'Alt+Ctrl+I',
				click() {
					mainWindow.toggleDevTools();
				}
			}]
		}];

		if (process.env.NODE_ENV === 'development') {
			var menu = Menu.buildFromTemplate(template);
			mainWindow.setMenu(menu);
		}
	}

	return mainWindow;
};