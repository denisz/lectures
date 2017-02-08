var React = require('react');
var _ = require('underscore');
var {DataStore} = require('./../services');

import './../assets/stylesheets/references.less'
module.exports = React.createClass({
	render () {
		var model = DataStore.references();

		return 	<div className="b-references">
					{
						model.format == "html"
						&& <webview  className="doc-content" src={model.path}/>
					}
				</div>
	}
});