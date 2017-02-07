var React = require('react');
var {Pager} = require('react-bootstrap');
var {Pagination} = require('./../controllers');
var {DataStore} = require('./../services');
var Page = require('./Page.react');

module.exports = React.createClass({
	displayName: "lecture",

	getInitialState() {
		var lecture = DataStore.lectureById(this.props.params.id);
		return {
			lecture 	: lecture,
			pagination 	: new Pagination(lecture.pages, this)
		}
	},

	render () {
		var page = this.state.pagination.current();

		return 	<div className="flex">
					<Page model={page} />
					<Pager onSelect={this.state.pagination.onChange}>
						<Pager.Item disabled={this.state.pagination.isPrev()} eventKey="previous">Previous</Pager.Item>
						{' '}
						<Pager.Item disabled={this.state.pagination.isNext()} eventKey="next">Next</Pager.Item>
					</Pager>
				</div>
	},

	didChangePage (pagination) {
		this.setState({
			pagination: pagination
		})
	},

	didReachEnd () {

	}
});