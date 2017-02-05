var React = require('react');
var _ = require('underscore');
var {Button} = require('react-bootstrap');
var {withRouter} = require('react-router');

module.exports = withRouter(React.createClass({
	render () {
		return 	<div className="b-app">
					{this.props.children}
				</div>
	}
}));