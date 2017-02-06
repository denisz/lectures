var app 			= require('./electron/app.js');
var Storage 		= require('./electron/storage.js');
var Updater 		= require('./electron/updater.js');
var welcomeWindow 	= require('./welcome.window.js');
var mainWindow 		= require('./main.window.js');
var {dialog} 		= require('electron');

app.on('ready', function () {
	var window = welcomeWindow().on('closed', mainWindow);
	var updater = new Updater();
	var storage = new Storage();

	setTimeout(()=>{
		window.close();
	}, 2000);

	// updater
	// 	.run()
	// 	.then((path) => {
	// 		return storage.loadWithPath(path)
	// 	})
	// 	.then(()=>{
	// 		app.use(storage.router());
	// 		setTimeout(()=>{
	// 			window.close();
	// 		}, 2000)
	// 	})
	// 	.catch((err)=>{
	// 		dialog.showErrorBox("Error", err);
	// 	})
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});