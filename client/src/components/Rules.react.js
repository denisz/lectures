var React = require('react');
var _ = require('underscore');
var {withRouter} = require('react-router');
var {Navbar, Nav, MenuItem} = require('react-bootstrap');

import '../assets/stylesheets/rules.less'

module.exports = withRouter(React.createClass({
	render () {
		return 	<div className="b-rules">
					<Navbar collapseOnSelect className="no-margin border-none background-white">
						<Navbar.Collapse>
							<Nav pullRight onSelect={this.handlerSelectMenu}>
								<MenuItem eventKey="close">Закрыть</MenuItem>
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<div className="pre-scrollable e-content">

					</div>
				</div>
	},

	handlerSelectMenu () {
		this.props.router.goBack();
	}
}));