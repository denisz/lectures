var React = require('react');
var _ = require('underscore');
var {Radio, FormGroup, Form, Button} = require('react-bootstrap');

module.exports = React.createClass({
	propTypes : {
		options : React.PropTypes.arrayOf(React.PropTypes.shape({
			label: React.PropTypes.string,
			value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
		})).isRequired,
		onChange: React.PropTypes.func,
		onSend: React.PropTypes.func.isRequired
	},

	getDefaultProps() {
		return {
			options :[],
			onChange : _.noop,
			onSend : _.noop
		}
	},

	getInitialState () {
		return {
			value : ""
		}
	},

	render () {
		return <Form>
					<FormGroup>
							{
								this.props.options.map((i, idx)=><Radio key={idx} name={"radio-btn-1"} value={i.value} onChange={this.handlerChange}>{i.label}</Radio>)
							}
						<Button onClick={this.handleSend}>Send</Button>
					</FormGroup>
				</Form>
	},

	handlerChange (event) {
		this.setState({
			value : event.target.value
		});
		this.props.onChange(event);
	},

	handleSend () {
		this.props.onSend(this.state.value)
	}
});