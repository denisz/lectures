var React = require('react');
var _ = require('underscore');
var {Pagination} = require('./../controllers');
var {DataStore} = require('./../services');
var Page = require('./Page.react');
var {withRouter} = require('react-router');
var {Button, Modal} = require('react-bootstrap');
var Control = require('./TestControl.react');
var Result = require('./../services/Result');

module.exports = withRouter(React.createClass({
	displayName: "lecture",

	getInitialState() {
		var lecture = DataStore.lectureById(this.props.params.id);
		var test = lecture.test;
		return {
			reachEnd 	: false,
			answers 	: new Result({
				lectureId: lecture.id
			}),
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
							<Modal.Title>Результат</Modal.Title>
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
		var pagination 	= this.state.pagination;
		var current 	= this.state.pagination.current();
		var answers 	= this.state.answers;

		answers.push({
			id 		: current.id,
			index 	: pagination.index,
			value 	: JSON.stringify(answer)
		});

		this.setState({
			answers: answers
		});
	},

	handleClose() {
		var answers = this.state.answers;
		answers.save().then(()=>{
			this.props.router.push("/");
		}, ()=>{
			this.props.router.push("/");
		})
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