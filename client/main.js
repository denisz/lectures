var app 			= require('./app.js');
var Storage 		= require('./storage.js');
var Updater 		= require('./updater.js');
var welcomeWindow 	= require('./welcome.window.js');
var mainWindow 		= require('./main.window.js');
var {dialog} 		= require('electron');

app.on('ready', function () {
	var window = welcomeWindow().on('closed', mainWindow);
	var updater = new Updater();
	var storage = new Storage();

	updater
		.run()
		.then((path) => {
			return storage.loadWithPath(path)
		})
		.then(()=>{
			app.use(storage.router());
			setTimeout(()=>{
				window.close();
			}, 2000)
		})
		.catch((err)=>{
			dialog.showErrorBox("Error", err.message);
			if (process.platform !== 'darwin') {
				app.quit();
			}
		})
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});