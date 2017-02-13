var React = require('react');
var _ = require('underscore');
var {Media} = require('react-bootstrap');
var styles = require('../assets/stylesheets/lectures.less');
var {withRouter} = require('react-router');
var {DataStore} = require('./../services');

module.exports = withRouter(React.createClass({
	displayName: "lectures",

	render () {
		var sections = DataStore.sections();

		var tests = _.pluck(sections, "lectures");

		return 	<div className="b-lectures">
			<h3 className="text-center">Лекции</h3>
			{
				sections.map((i, idx)=>{
					return <Media key={idx}>
							<Media.Left>
								<img width={64} height={64} src="./images/welcome.png" alt="Image"/>
							</Media.Left>
							<Media.Body>
								<Media.Heading>{i.title || i.name}</Media.Heading>
								<p>{i.description}</p>
								{

									i.lectures.map((i, idx)=>{
										return <Media key={idx} onClick={_.bind(this.handlerClick, this, i)} className="cursor-pointer">
													<Media.Left>
														<img width={64} height={64} src="./images/welcome.png" alt="Image"/>
													</Media.Left>
													<Media.Body>
														<Media.Heading>{i.title || i.name}</Media.Heading>
														<p>{i.description}</p>
													</Media.Body>
												</Media>
									})
								}
							</Media.Body>
						</Media>
					})
			}
		</div>
	},
	handlerClick (lecture) {
		this.props.router.push("lecture/" + lecture.id);
	}
}));