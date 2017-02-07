module.exports = ()=>{
	var _reject, _resolve;

	var promise = new Promise((resolve, reject)=>{
		_resolve = resolve;
		_reject = reject;
	});

	return {
		reject  : _reject,
		resolve : _resolve,
		promise : promise
	}
};