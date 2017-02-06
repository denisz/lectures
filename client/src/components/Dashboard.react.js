var React = require('react');
var _ = require('underscore');
var styles = require('../assets/stylesheets/dashboard.less');
var {Navbar, Nav, NavDropdown, MenuItem, NavItem} = require('react-bootstrap');
var {Glyphicon} = require('react-bootstrap');
var {withRouter} = require('react-router');


module.exports = withRouter(React.createClass({
	render () {
		return <div className="b-dashboard">
				<div style={{width: "100%"}}>
					<Navbar collapseOnSelect className="no-margin background-white">
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
								<NavDropdown title="Меню" id="basic-nav-dropdown">
									<MenuItem eventKey="profile">Профиль</MenuItem>
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