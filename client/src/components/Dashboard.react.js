var React = require('react');
var _ = require('underscore');
var styles = require('../assets/stylesheets/dashboard.less');
var {Navbar, Nav, NavDropdown, MenuItem, NavItem} = require('react-bootstrap');
var {Glyphicon} = require('react-bootstrap');

module.exports = React.createClass({
	render () {
		return <div className="b-dashboard">
					<div style={{width: "100%"}}>
						<Navbar collapseOnSelect className="no-margin background-white">
							<Navbar.Header>
								<Navbar.Brand>
									<a href="#">React-Bootstrap</a>
								</Navbar.Brand>
								<Navbar.Toggle />
							</Navbar.Header>
							<Navbar.Collapse>
								<Nav>
									<NavItem eventKey={1} href="#">Link</NavItem>
									<NavItem eventKey={2} href="#">Link</NavItem>
									<NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
										<MenuItem eventKey={3.1}>Action</MenuItem>
										<MenuItem eventKey={3.2}>Another action</MenuItem>
										<MenuItem eventKey={3.3}>Something else here</MenuItem>
										<MenuItem divider />
										<MenuItem eventKey={3.3}>Separated link</MenuItem>
									</NavDropdown>
								</Nav>
								<Nav pullRight>
									<NavItem eventKey={1} href="#">Link Right</NavItem>
									<NavItem eventKey={2} href="#">
										<Glyphicon glyph="menu-hamburger"/>
									</NavItem>
								</Nav>
							</Navbar.Collapse>
						</Navbar>
					</div>
					{this.props.children}
				</div>
	}
});