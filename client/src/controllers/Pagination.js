var _ = require('underscore');

var Pagination = function (pages, delegate) {
	this.index = 0;
	this.pages = pages || [];
	this.delegate = delegate;

	this.onChange = _.bind(this.onChange, this);
	this.prev = _.bind(this.prev, this);
	this.next = _.bind(this.next, this);
};

Pagination.prototype.current = function () {
	return this.pages[this.index];
};

Pagination.prototype.onChange = function (event) {
	switch (event){
		case "previous"	: return this.prev();
		case "next" 	: return this.next();
	}
};

Pagination.prototype.next = function () {
	this.index = Math.max(Math.min(this.index + 1, this.max()), 0);
	if (this.delegate && _.isFunction(this.delegate.didChangePage)) {
		this.delegate.didChangePage(this);
	}

	if (this.isEnd()) {
		if (this.delegate && _.isFunction(this.delegate.didReachEnd)) {
			this.delegate.didReachEnd(this);
		}
	}
};

Pagination.prototype.prev = function () {
	this.index = Math.max(Math.min(this.index - 1, this.max()), 0);
	if (this.delegate && _.isFunction(this.delegate.didChangePage)) {
		this.delegate.didChangePage(this);
	}
};

Pagination.prototype.isNext = function () {
	return this.index < this.max();
};

Pagination.prototype.isEnd = function () {
	return this.index == this.max();
};

Pagination.prototype.isPrev = function () {
	return this.index > 0;
};

Pagination.prototype.isStart = function () {
	return this.index == 0;
};

Pagination.prototype.max = function () {
	return this.size() - 1;
};

Pagination.prototype.size = function () {
	return this.pages.length;
};

module.exports = Pagination;