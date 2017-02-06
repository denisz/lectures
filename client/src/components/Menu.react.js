var React = require('react');
var _ = require('underscore');
var {Nav, NavItem} = require('react-bootstrap');
var {withRouter} = require('react-router');
module.exports = withRouter(React.createClass({
	render () {
		return 	<div className="vertical-center">
					<Nav bsStyle="pills" stacked activeKey={1} onSelect={this.handleSelect}>
						<NavItem eventKey={1} href="/home">NavItem 1 content</NavItem>
						<NavItem eventKey={2} title="Item">NavItem 2 content</NavItem>
						<NavItem eventKey={3} disabled>NavItem 3 content</NavItem>
					</Nav>
				</div>
	},

	handleSelect () {
		this.props.router.push("lecture")
	}
}))