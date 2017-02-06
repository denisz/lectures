var AdmZip = require('adm-zip');
var path = require('path');
var os = require('os');
var hashFiles = require('hash-files');

module.exports = function () {
	var zipPath = "./dist/data.zip";
	var zip = new AdmZip(zipPath);
	var targetPath = path.join(os.homedir(), "lectures");

	hashFiles({
		files: [zipPath],
		algorithm : "sha1"
	}, function(){
		console.log(arguments);
	});

	zip.extractAllTo(targetPath, true);
};