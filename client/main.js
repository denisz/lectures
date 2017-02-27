var app 		= require('./app.js');
var Storage 	= require('./storage.js');
var Updater 	= require('./updater.js');
var Download 	= require('./downloadDL.js');
var welcome 	= require('./welcome.window.js');
var main 		= require('./main.window.js');
var {dialog} 	= require('electron');
var social 		= require('./social.js');

app.on('ready', function () {
	var window = welcome();
	var updater  = new Updater();
	var storage  = new Storage();
	var download = new Download();

	window.on('closed', ()=>{
		window = main();
		window.on('closed', ()=>{
			app.quit();
		})
	});

	updater
		.run()
		.then((path) => {
			return storage.loadWithPath(path)
		})
		.then(()=>{
			app.use(storage.router());
			app.use(download.router());
			setTimeout(()=>{
				window.close();
			}, 4000)
		})
		.catch((err)=>{
			dialog.showErrorBox("Error", err.message);
		})
});

app.on('window-all-closed', function () {});

app.use(social);