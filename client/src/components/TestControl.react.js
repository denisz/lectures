var React = require('react');
var _ = require('underscore');
var controls = require('./Controls');

module.exports = React.createClass({
	propTypes : {
		type  	 : React.PropTypes.oneOf(_.keys(controls)),
		options  : React.PropTypes.any,
		onChange : React.PropTypes.func
	},

	getDefaultProps () {
		return {
			onChange : _.noop,
			type  	 : "textfield"
		}
	},

	render () {
		var Component = controls[this.props.type];
		return React.createElement(Component, _.extend({},
			{
				options : this.props.options
			},
			{
				onChange : this.handlerChange,
				onSend : this.handlerSend
			}
		))
	},

	handlerSend (value) {
		this.props.onChange(value);
	},

	handlerChange () {

	}
});