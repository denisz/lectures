var React = require('react');
var _ = require('underscore');
var {withRouter} = require('react-router');
var {User} = require('./../services');

module.exports = withRouter(React.createClass({
	componentWillMount () {
		_.delay(()=>{
			User.logout();
			this.props.router.push("/");
		})
	},

	render () {
		return <div />
	}
}))