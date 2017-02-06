var AdmZip = require('adm-zip');
var path = require('path');
var os = require('os');
var fs = require('fs');
var hashFiles = require('hash-files');
var RSVP = require('rsvp');
var _ = require('underscore');

function calculateHash (path) {
	var deferred = RSVP.defer("calculate");
	try {
		hashFiles({
			files: [path],
			algorithm : "sha256"
		}, function (_, hash) {
			deferred.resolve(hash)
		});
	} catch(e) {
		deferred.reject(e);
	}

	return deferred.promise;
}

function unzip (from, to) {
	var deferred = RSVP.defer("unzip");
	var zip = new AdmZip(from);
	var filename = path.basename(from).split(".")[0];

	zip.extractAllToAsync(to, true, function (error) {
		if (error != null) {
			deferred.reject(error);
		} else {
			deferred.resolve(path.join(to, filename));
		}
	});

	return deferred.promise;
}

function firstFulfilled (results) {
	for (var i = 0, l = results.length; i < l; i++) {
		if (results[i].state == 'fulfilled') {
			return results[i].value
		}
	}

	return false
}

var Updater = function () {
	this.buildZipPath 		= "./dist/data.zip";
	this.remoteZipPath 	= path.join(os.homedir(), "data.zip");
	this.targetPath 	= path.join(os.homedir(), "lectures");
};

//файл из билда
Updater.prototype.getLocalFile = function () {
	var deferred = RSVP.defer("getLocalFile");
	var path = this.buildZipPath;

	if (fs.existsSync(path)) {
		_.delay(()=>{
			deferred.resolve(path);
		})
	} else {
		_.delay(()=>{
			deferred.reject(new Error("The computer searched the file system, unfortunately however, the file was not found."));
		})
	}

	return deferred.promise;
};

//файл который мы заливали
Updater.prototype.getRemoteFile = function () {
	var deferred = RSVP.defer("getRemoteFile");
	var path = this.remoteZipPath;

	if (fs.existsSync(path)) {
		_.delay(()=>{
			deferred.resolve(path);
		})
	} else {
		_.delay(()=>{
			deferred.reject(new Error("The computer searched the file system, unfortunately however, the file was not found."));
		})
	}

	return deferred.promise;
};

//отправить запрос на сервер за новой версии
Updater.prototype.checkVersion = function (path) {
	return calculateHash(path)
			.then(function (hash) {
				return path;
				//
				//fetch()
				// .then(()=>{
				//		return download(this.remoteZipPath)
				// })
				//.then(()=>{
				//
				// })
			})
};

Updater.prototype.run = function () {
	return RSVP.hashSettled({
			local : this.getLocalFile(),
			remote: this.getRemoteFile()
		}, "run")
		.then((results) => {
			var path = firstFulfilled([results.remote, results.local]);

			if (path) {
				return this.checkVersion(path);
			} else {
				throw new Error("The computer searched the file system, unfortunately however, the file was not found.")
			}
		})
		.then((path)=>{
			return unzip(path, this.targetPath)
		});
};

module.exports = Updater;