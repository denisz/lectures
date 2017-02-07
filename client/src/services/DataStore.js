var {Lecture, Test, Page, Section } = require('./../models');
var _ = require('underscore');

var DataStore = function () {
	this._sections = [];
	this._lectures = [];
	this._pages    = [];
	this._tests    = [];
};

DataStore.prototype.loadData = function (data) {
	var sections = [];

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

			for (var p in _lecture.tests) {
				var _test = _lecture.tests[p];
				var test = Test(_test.manifest);

				test.path   = _test.path;
				test.format = _test.format;
				test.name 	= p;
				lecture.tests.push(test);
				this._tests.push(test);
			}

			section.lectures.push(lecture);
			this._lectures.push(lecture);
		}
		sections.push(section)
	}

	this._sections = sections;
};

DataStore.prototype.sections = function () {
	return this._sections
};

DataStore.prototype.lectureById = function (id) {
	return _.findWhere(this._lectures, {id : id});
};

module.exports = DataStore;