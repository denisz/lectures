var React = require('react');
var _ = require('underscore');
var {Nav, NavItem} = require('react-bootstrap');
var {withRouter} = require('react-router');
var styles = require('./../assets/stylesheets/menu.less');

module.exports = withRouter(React.createClass({
	render () {
		return 	<div className="b-menu">
					<Nav bsStyle="pills" stacked activeKey={0} onSelect={this.handleSelect}>
						<NavItem eventKey={"lectures"} 	>Теория</NavItem>
						<NavItem eventKey={"practice"} 	>Практика</NavItem>
						<NavItem eventKey={"tests"} 	>Тесты</NavItem>
						<NavItem eventKey={"links"} 	>Ссылки</NavItem>
						<NavItem eventKey={"other"} 	>Прочее</NavItem>
						<NavItem eventKey={"about"} 	>О программе</NavItem>
					</Nav>
				</div>
	},

	handleSelect (eventKey) {
		this.props.router.push(eventKey)
	}
}));