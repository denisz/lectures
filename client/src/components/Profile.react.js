var React = require('react');
var _ = require('underscore');
var {User} = require('./../services');
var {Image} = require('react-bootstrap');

import './../assets/stylesheets/profile.less'

module.exports = React.createClass({
	render () {
		var user = User.current();

		return 	<div className="b-profile">
					<Image src={user.picture} circle/>
					<h3 className="text-center">{user.name}</h3>
				</div>
	}
});