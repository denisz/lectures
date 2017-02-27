var fs   		= require('fs');
var http 		= require('http');

module.exports = function(url, target) {
	return new Promise(( resolve, reject )=> {
		http.get(url, (response) => {
			response.pipe(fs.createWriteStream(target)).on('close', (e)=>{
				resolve(target);
			});
		});
	})
};


