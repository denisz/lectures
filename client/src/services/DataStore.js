var {Lecture, Test, Page, Section, Ref, Item } = require('./../models');
var _ = require('underscore');

var DataStore = function () {
	this._sections = [];
	this._lectures = [];
	this._pages    = [];
	this._tests    = [];
	this._refs     = [];
};

DataStore.prototype.loadData = function (data) {
	console.log("Settings: ", data);
	this._refs = data.references;


	for (var i in data.sections) {
		var _section = data.sections[i];
		var section = Section(_section.manifest);
		section.name = i;

		for (var j in _section.lectures) {
			var _lecture = _section.lectures[j];
			var lecture = Lecture(_lecture.manifest);
			lecture.name = j;

			for (var p in _lecture.pages) {
				var _page = _lecture.pages[p];
				var page = Page(_page.manifest);

				page.path   = _page.path;
				page.format = _page.format;
				page.name 	= p;
				lecture.pages.push(page);
				this._pages.push(page);
			}

			if (_lecture.test) {
				var test = Test(_lecture.test.manifest);
				lecture.test = test;
				test.lecture = lecture;

				for (var i in _lecture.test.items) {
					var _item = _lecture.test.items[i];
					var item = Item(_item.manifest);
					item.path 	= _item.path;
					item.format = _item.format;
					item.name 	= i;

					test.items.push(item)
				}

				this._tests.push(test);
			}

			section.lectures.push(lecture);
			this._lectures.push(lecture);
		}
		this._sections.push(section)
	}
};

DataStore.prototype.sections = function () {
	return this._sections
};

DataStore.prototype.tests = function () {
	return this._tests
};

DataStore.prototype.references = function () {
	return this._refs
};

DataStore.prototype.lectureById = function (id) {
	return _.findWhere(this._lectures, {id : id});
};

module.exports = DataStore;