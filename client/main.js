var app 			= require('./backend/app.js');
var Storage 		= require('./backend/storage.js');
var Updater 		= require('./backend/updater.js');
var welcomeWindow 	= require('./backend/welcome.window.js');
var mainWindow 		= require('./backend/main.window.js');
var config 			= require('./package.json');

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
			console.log(err);
		})
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});