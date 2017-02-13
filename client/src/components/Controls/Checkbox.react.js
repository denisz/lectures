var React = require('react');
var _ = require('underscore');
var {Checkbox, FormGroup, Form, Button} = require('react-bootstrap');

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
			values : []
		}
	},

	render () {
		return <Form>
					<FormGroup>
						{
							this.props.options.map((i, idx)=><Checkbox key={idx} value={i.value} onChange={this.handleChange}>{i.label}</Checkbox>)
						}

						<Button onClick={this.handleSend}>Send</Button>
					</FormGroup>
				</Form>
	},

	handleChange (event) {
		var values = this.state.values;
		values.push(event.target.value);
		this.setState({
			values: values
		});
		this.props.onChange(event)
	},

	handleSend () {
		this.props.onSend(this.state.values)
	}
});