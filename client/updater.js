var AdmZip = require('adm-zip');
var path = require('path');
var os = require('os');
// var fs = require('fs');
var fs = require('fs-extra');
var hashFiles = require('hash-files');
var hashSettled = require('./hashSettled.js');
var download = require('./download.js');
var serverHashFile = require('./serverHash');

function calculateHash (path) {
	return new Promise((resolve, reject)=>{
		try {
			hashFiles({
				files: [path],
				algorithm : "sha256"
			}, function (_, hash) {
				resolve(hash)
			});
		} catch(e) {
			reject(e);
		}
	});
};

function unzip (from, to) {
	return new Promise((resolve, reject)=>{
		try {
			var zip = new AdmZip(from);
			var filename 	= path.basename(from).split(".")[0];
			var target  	= path.join(to, filename);
			var tmp 		= path.join(to, "tmp_" + filename);


			if (fs.existsSync(target)) {
				fs.removeSync(tmp);
				fs.renameSync(target, tmp);
			}

			zip.extractAllToAsync(to, true, function (error) {
				if (error != null) {
					fs.renameSync(tmp, target);
					console.log(error);
					reject(error);
				} else {
					resolve(target);
					fs.removeSync(tmp);
				}
			});
		} catch (e) {
			console.log(e);
		}

	})
}

function firstFulfilled (results) {
	for (var i = 0, l = results.length; i < l; i++) {
		if (results[i].state == 'fulfilled') {
			return results[i].value
		}
	}

	return false
}

var Updater = function (url, port) {
	this.serverUrl 		= url;
	this.serverPort 	= port;

	this.buildZipPath 	= path.join(__dirname, "dist/data.zip");
	this.remoteZipPath 	= path.join(os.homedir(), "data.zip");
	this.targetPath 	= path.join(os.homedir(), "lectures");
};

//файл из билда
Updater.prototype.getLocalFile = function () {
	return new Promise((resolve, reject)=>{
		var path = this.buildZipPath;

		if (fs.existsSync(path)) {
			resolve(path);
		} else {
			reject(new Error("The computer searched the file system, unfortunately however, the file was not found."));
		}
	})
};

//файл который мы заливали
Updater.prototype.getRemoteFile = function () {
	return new Promise((resolve, reject)=>{
		var path = this.remoteZipPath;

		if (fs.existsSync(path)) {
			resolve(path);
		} else {
			reject(new Error("The computer searched the file system, unfortunately however, the file was not found."));
		}
	})
};

//отправить запрос на сервер за новой версии
Updater.prototype.checkVersion = function (_path) {
	return hashSettled ({
				"local" 	: calculateHash(_path),
				"remote" 	: serverHashFile(path.join(`${this.serverUrl}:${this.serverPort}`, 'updater'))
			})
			.then((results) => {
				if (
						results.remote["state"] == 'fulfilled'
					&& 	results.remote["value"] != results.remote) {
					return download(path.join(`${this.serverUrl}:${this.serverPort}`, 'data'), this.remoteZipPath);
				}

				return _path
			})
			.then((path)=>{
				return path;
			})
};

Updater.prototype.run = function () {
	return hashSettled({
			local : this.getLocalFile(),
			remote: this.getRemoteFile()
		})
			.then((results) => {
				var path = firstFulfilled([results.remote, results.local]);

				if (path) {
					return this.checkVersion(path);
				} else {
					throw new Error("The computer searched the file system, unfortunately however, the file was not found.")
				}
			})
			.then((path)=>{
				console.log(path, this.targetPath);
				return unzip(path, this.targetPath)
			});
};

module.exports = Updater;