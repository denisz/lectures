var React = require('react');
var _ = require('underscore');
var {Media} = require('react-bootstrap');
var styles = require('../assets/stylesheets/lectures.less');
var {withRouter} = require('react-router');
var {DataStore} = require('./../services');

module.exports = withRouter(React.createClass({
	displayName: "lectures",

	render () {
		var tests = DataStore.tests();

		return 	<div className="b-lectures">
			<h3>Тесты</h3>
			{
				tests.map((i, idx)=>{
					return <Media key={idx} onClick={_.bind(this.handlerClick, this, i)} className="cursor-pointer">
						<Media.Left>
							<img width={64} height={64} src="./images/welcome.png" alt="Image"/>
						</Media.Left>
						<Media.Body>
							<Media.Heading>{i.title || i.name || ("Тест " + idx)}</Media.Heading>
						</Media.Body>
					</Media>
				})
			}
		</div>
	},

	handlerClick (test) {
		this.props.router.push("test/" + test.lecture.id);
	}
}));