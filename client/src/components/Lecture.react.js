var React = require('react');
var _ = require('underscore');
var {Pager, Button} = require('react-bootstrap');
var {Pagination} = require('./../controllers');
var {DataStore} = require('./../services');
var Page = require('./Page.react');
var {If} = require('react-if');
var {withRouter} = require('react-router');

module.exports = withRouter(React.createClass({
	displayName: "lecture",

	getInitialState() {
		var lecture = DataStore.lectureById(this.props.params.id);
		return {
			reachEnd 	: false,
			lecture 	: lecture,
			pagination 	: new Pagination(lecture.pages, this)
		}
	},

	render () {
		var page = this.state.pagination.current();

		return 	<div className="flex">
					<Page model={page} />
					<Pager onSelect={this.state.pagination.onChange}>
						<Pager.Item disabled={this.state.pagination.isStart()} eventKey="previous">Previous</Pager.Item>
						{' '}
						<Pager.Item disabled={this.state.pagination.isEnd()} eventKey="next">Next</Pager.Item>
						{' '}
						<If condition={this.hasTest()}>
							<Button componentClass="a" disabled={!this.shouldStartTest()} bsStyle="success" onClick={this.didTapExamine}>Examine</Button>
						</If>

					</Pager>
				</div>
	},

	hasTest () {
		return !_.isNull(this.state.lecture.test);
	},

	shouldStartTest () {
		return  this.state.reachEnd && this.hasTest()
	},

	didTapExamine () {
		var id = this.state.lecture.id;
		this.props.router.push("test/" + id)
	},

	didChangePage (pagination) {
		this.setState({
			pagination: pagination
		})
	},

	didReachEnd () {
		console.log("didReachEnd");
		this.setState({
			reachEnd : true
		})
	}
}));