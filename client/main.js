var updater = require('./updater.js');
var {app, Menu, BrowserWindow, shell} = require('electron');

var menu, template, mainWindow;

function createWelcome () {
	let welcome = new BrowserWindow({
		show: false,
		width: 500,
		height: 300,
		frame: false,
		center : true,
		resizable : false,
		alwaysOnTop : true,
		titleBarStyle: 'hidden'
	});
	welcome.loadURL('file://' + __dirname + '/dist/welcome.html');
	welcome.setIgnoreMouseEvents(true);
	welcome.on('closed', () => {
		setTimeout(()=> {
			createWindow();
		}, 1000)
	});
	welcome.webContents.on('did-finish-load', () => {
		setTimeout(()=>{
			welcome.show();
			welcome.focus();
		}, 1000)
	});

	updater();

	setTimeout(()=>{
		welcome.close();
	}, 10000)
}

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
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

	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('closed', () => {
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
		template = [{
			label: 'Electron',
			submenu: [{
				label: 'About ElectronReact',
				selector: 'orderFrontStandardAboutPanel:'
			}, {
				type: 'separator'
			}, {
				label: 'Services',
				submenu: []
			}, {
				type: 'separator'
			}, {
				label: 'Hide ElectronReact',
				accelerator: 'Command+H',
				selector: 'hide:'
			}, {
				label: 'Hide Others',
				accelerator: 'Command+Shift+H',
				selector: 'hideOtherApplications:'
			}, {
				label: 'Show All',
				selector: 'unhideAllApplications:'
			}, {
				type: 'separator'
			}, {
				label: 'Quit',
				accelerator: 'Command+Q',
				click() {
					app.quit();
				}
			}]
		}, {
			label: 'Edit',
			submenu: [{
				label: 'Undo',
				accelerator: 'Command+Z',
				selector: 'undo:'
			}, {
				label: 'Redo',
				accelerator: 'Shift+Command+Z',
				selector: 'redo:'
			}, {
				type: 'separator'
			}, {
				label: 'Cut',
				accelerator: 'Command+X',
				selector: 'cut:'
			}, {
				label: 'Copy',
				accelerator: 'Command+C',
				selector: 'copy:'
			}, {
				label: 'Paste',
				accelerator: 'Command+V',
				selector: 'paste:'
			}, {
				label: 'Select All',
				accelerator: 'Command+A',
				selector: 'selectAll:'
			}]
		}, {
			label: 'View',
			submenu: (process.env.NODE_ENV === 'development' || true) ? [{
				label: 'Reload',
				accelerator: 'Command+R',
				click() {
					mainWindow.webContents.reload();
				}
			}, {
				label: 'Toggle Full Screen',
				accelerator: 'Ctrl+Command+F',
				click() {
					mainWindow.setFullScreen(!mainWindow.isFullScreen());
				}
			}, {
				label: 'Toggle Developer Tools',
				accelerator: 'Alt+Command+I',
				click() {
					mainWindow.toggleDevTools();
				}
			}] : [{
				label: 'Toggle Full Screen',
				accelerator: 'Ctrl+Command+F',
				click() {
					mainWindow.setFullScreen(!mainWindow.isFullScreen());
				}
			}]
		}, {
			label: 'Window',
			submenu: [{
				label: 'Minimize',
				accelerator: 'Command+M',
				selector: 'performMiniaturize:'
			}, {
				label: 'Close',
				accelerator: 'Command+W',
				selector: 'performClose:'
			}, {
				type: 'separator'
			}, {
				label: 'Bring All to Front',
				selector: 'arrangeInFront:'
			}]
		}, {
			label: 'Help',
			submenu: [{
				label: 'Learn More',
				click() {
					shell.openExternal('http://electron.atom.io');
				}
			}, {
				label: 'Documentation',
				click() {
					shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
				}
			}, {
				label: 'Community Discussions',
				click() {
					shell.openExternal('https://discuss.atom.io/c/electron');
				}
			}, {
				label: 'Search Issues',
				click() {
					shell.openExternal('https://github.com/atom/electron/issues');
				}
			}]
		}];

		if (process.env.NODE_ENV === 'development') {
			menu = Menu.buildFromTemplate(template);
			mainWindow.setMenu(menu);
		}
	} else {
		template = [{
			label: '&File',
			submenu: [{
				label: '&Open',
				accelerator: 'Ctrl+O'
			}, {
				label: '&Close',
				accelerator: 'Ctrl+W',
				click() {
					mainWindow.close();
				}
			}]
		}, {
			label: '&View',
			submenu: (process.env.NODE_ENV === 'development') ? [{
				label: '&Reload',
				accelerator: 'Ctrl+R',
				click() {
					mainWindow.webContents.reload();
				}
			}, {
				label: 'Toggle &Full Screen',
				accelerator: 'F11',
				click() {
					mainWindow.setFullScreen(!mainWindow.isFullScreen());
				}
			}, {
				label: 'Toggle &Developer Tools',
				accelerator: 'Alt+Ctrl+I',
				click() {
					mainWindow.toggleDevTools();
				}
			}] : [{
				label: 'Toggle &Full Screen',
				accelerator: 'F11',
				click() {
					mainWindow.setFullScreen(!mainWindow.isFullScreen());
				}
			}]
		}, {
			label: 'Help',
			submenu: [{
				label: 'Learn More',
				click() {
					shell.openExternal('http://electron.atom.io');
				}
			}, {
				label: 'Documentation',
				click() {
					shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
				}
			}, {
				label: 'Community Discussions',
				click() {
					shell.openExternal('https://discuss.atom.io/c/electron');
				}
			}, {
				label: 'Search Issues',
				click() {
					shell.openExternal('https://github.com/atom/electron/issues');
				}
			}]
		}];

		if (process.env.NODE_ENV === 'development') {
			menu = Menu.buildFromTemplate(template);
			mainWindow.setMenu(menu);
		}
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWelcome);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
