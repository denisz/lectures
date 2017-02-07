var React = require('react');
var _ = require('underscore');

var styles = require('./../assets/stylesheets/page.less');

module.exports = React.createClass({
	propTypes : {
		model : React.PropTypes.object.isRequired
	},
	render () {
		return 	<div className="b-page">
					{
						this.props.model.format == "html"
						&& <webview  className="doc-content" src={this.props.model.path}/>
					}
				</div>
	}
})