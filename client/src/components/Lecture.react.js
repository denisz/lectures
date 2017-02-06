var React = require('react');
var _ = require('underscore');
var {Pager, Row, Col} = require('react-bootstrap');

module.exports = React.createClass({
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