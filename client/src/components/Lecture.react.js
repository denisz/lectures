var React = require('react');
var _ = require('underscore');
var {Pager, Row, Col} = require('react-bootstrap');
var Pagination = require('./../services');

module.exports = React.createClass({
	propTypes: {
		model: React.PropTypes.object.required
	},

	getInitialState() {
		return {
			// pagination : new Pagination(this.props.model, this)
		}
	},

	render () {
		return 	<div className="flex">
					<webview  className="doc-content" src="./data/documents/lecture1/pages/page1/page1.html"/>
					<Pager>
						<Pager.Item previous href="#">&larr; Previous Page</Pager.Item>
						<Pager.Item next href="#">Next Page &rarr;</Pager.Item>
					</Pager>
				</div>
	}
});