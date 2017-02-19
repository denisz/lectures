require('whatwg-fetch');

module.exports = function (request) {
	return window.fetch(request.absoluteString(), {
		method 		: request.method(),
		headers 	: request.headers(),
		body 		: request.body()
	}).then((response) => {
		return response.json()
	})
};