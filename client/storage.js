var path = require('path');
var fs = require('fs');
var _ = require('underscore');
/**
 * this.scheme = {
 * 	documents : {
 * 		lectures : {
 * 			lecture1: {},
 *			lecture2: {},
 * 			manifest : manifest,
 * 			path :
 * 		},
 * 		manifest : manifest,
 * 		path:
 * 	}
 * }
 * @constructor
 */
var Storage = function () {
	this.documents = {};
	this.manifest = {};
};

Storage.prototype.loadWithPath = function (_path) {
	return new Promise((resolve, reject)=>{
		console.log("Start scan: ", _path);

		function walk(_path, done) {
			var result = {};

			fs.readdir(_path, (err, list)=>{
				if (err) return reject();
				var i = 0 ;
				(function next(){
					var filename = list[i++];
					if (!filename) return done(result);

					var nodePath = _path + '/' + filename;

					fs.stat(nodePath, (err, stat) => {
						if (err) return next();
						// console.log("Node path: ", nodePath, "filename: ", filename);

						if (stat && stat.isDirectory()) {
							if (filename == "images") return next();

							walk(nodePath, (middle)=>{
								result[filename] = middle;
								next();
							});
						} else {
							switch (path.extname(filename)) {
								case ".json":
									fs.readFile(nodePath, 'utf8', (err, data)=>{
										if (!err) {
											try {
												if (data != "") {
													result.manifest = _.extend({}, result.manifest, JSON.parse(data));
												}
											} catch (e) {
												console.error(nodePath, e);
											}
										}
										next();
									});
									break;
								case  ".html":
									result.path = nodePath;
									result.format = "html";
									next();
									break;
								case  ".pdf":
									result.path = nodePath;
									result.format = "pdf";
									next();
									break;
								default:
									next();
							}
						}
					})
				})();
			});

			return result;
		}

		walk(_path, (result) => {
			if (_.has(result, "documents")) {
				this.documents = result.documents;
			}

			if (_.has(result, "manifest")) {
				this.manifest = result.manifest;
			}

			// console.log(JSON.stringify(this.documents, null, '\t'));
			// console.log(JSON.stringify(this.manifest, null, '\t'));

			resolve()
		});
	});
};

Storage.prototype.router = function () {
	return {
		"app-storage-documents" : (event, args) => {
			event.returnValue = this.documents
		},
		"app-storage-manifest" : (event, args) => {
			event.returnValue = this.manifest
		}
	}
};

module.exports = Storage;