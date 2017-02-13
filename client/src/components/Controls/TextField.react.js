var React = require('react');
var _ = require('underscore');
var {InputGroup, FormGroup, Form, Button, FormControl} = require('react-bootstrap');

module.exports = React.createClass({
	propTypes : {
		onSend: React.PropTypes.func.isRequired,
		onChange: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			onSend : _.noop,
			onChange : _.noop
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
						<InputGroup>
							<FormControl type="text"
										 value={this.state.value}
										 onChange={this.onChange}/>
							<InputGroup.Button>
								<Button onClick={this.handlerSend}>Send</Button>
							</InputGroup.Button>
						</InputGroup>
					</FormGroup>
				</Form>
	},

	onChange(event) {
		console.log(event.target.value);
		this.setState({
			value : event.target.value
		});
		this.props.onChange(event);
	},

	handlerSend () {
		this.props.onSend(this.state.value)
	}
});