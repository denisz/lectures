var React = require('react');
var {Navbar, Nav, NavDropdown, MenuItem, NavItem} = require('react-bootstrap');
var {Image} = require('react-bootstrap');
var {withRouter} = require('react-router');
var {User} = require('../services');

import '../assets/stylesheets/dashboard.less'

var Profile = React.createClass({
	render () {
		var user = User.current();
		return 	<div>
					<Image src={user.picture} circle />
				</div>
	}
});

module.exports = withRouter(React.createClass({
	getInitialState () {
		return {

		}
	},
	render () {
		var user = User.current();

		return <div className="b-dashboard">
				<div style={{width: "100%"}}>
					<Navbar collapseOnSelect className="no-margin border-none background-white">
						<Navbar.Header style={{marginLeft: 50}}>
							<Navbar.Brand>
								<a href="#">Bytex-lectures</a>
							</Navbar.Brand>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav onSelect={this.handlerSelectMenu}>
								<NavItem eventKey={"menu"}>Главная</NavItem>
							</Nav>
							<Nav pullRight onSelect={this.handlerSelectMenu}>
								<NavDropdown title={user.name} id="basic-nav-dropdown">
									<MenuItem eventKey="profile">Профиль</MenuItem>
									<MenuItem eventKey="admin">Админ панель</MenuItem>
									<MenuItem eventKey="settings">Настройки</MenuItem>
									<MenuItem divider />
									<MenuItem eventKey="logout">Выход</MenuItem>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
					</Navbar>
				</div>
				{this.props.children}
			</div>
	},

	handlerSelectMenu(eventKey) {
		this.props.router.push(`${eventKey}`)
	}
}));