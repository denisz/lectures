var {net} = require('electron');

module.exports = function (url) {
	return new Promise((resolve, reject)=>{
		var data = "";
		var request = net.request(url);

		request.on('response', (response) => {
			response.on('data', (chunk) => {
				data += chunk;
			});

			response.on('end', () => {
				resolve(data);
			})
		});

		request.on('error', (err)=>{
			reject(err);
		});

		request.end();
	})
};