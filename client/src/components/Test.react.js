var React = require('react');
var _ = require('underscore');
var {Pagination} = require('./../controllers');
var {DataStore} = require('./../services');
var Page = require('./Page.react');
var {withRouter} = require('react-router');
var {Button, Modal} = require('react-bootstrap');
var Control = require('./TestControl.react');

module.exports = withRouter(React.createClass({
	displayName: "lecture",

	getInitialState() {
		var lecture = DataStore.lectureById(this.props.params.id);
		var test = lecture.test;
		return {
			reachEnd 	: false,
			answers 	: {},
			showModal   : false,
			test 		: test,
			pagination 	: new Pagination(test.items, this)
		}
	},

	render () {
		var item = this.state.pagination.current();

		return 	<div className="flex">
					<Page model={item} />
					<div style={{maxWidth: 824}}>
						<hr/>
						<Control {...item} onChange={this.handlerAnswer}/>
					</div>

					<Modal show={this.state.showModal} onHide={this.handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Modal heading</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<h4>Тест пройден</h4>
							<p>
								{JSON.stringify(this.state.answers)}
							</p>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={this.handleClose}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
	},

	handlerAnswer (answer) {
		this.fixAnswer(answer);

		if (this.state.reachEnd) {
			this.setState({
				showModal: true
			})
		} else {
			this.state.pagination.next();
		}
	},

	fixAnswer (answer) {
		var current = this.state.pagination.current();
		var answers = this.state.answers;
		answers[current.id] = answer;

		this.setState({
			answers: answers
		});
	},

	handleClose() {
		this.props.router.push("/");
	},

	handleChange (answer) {
		this.setState({
			answer: answer
		})
	},

	didChangePage (pagination) {
		this.setState({
			pagination: pagination
		})
	},

	didReachEnd () {
		this.setState({
			reachEnd: true
		})
	}
}));