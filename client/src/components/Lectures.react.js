var React = require('react');
var _ = require('underscore');
var {Media} = require('react-bootstrap');
var styles = require('../assets/stylesheets/lectures.less');
var {withRouter} = require('react-router');

module.exports = withRouter(React.createClass({
	render () {
		return 	<div className="b-lectures">
			{
				_.times(4, (i)=>{
					return <Media key={i}>
						<Media.Left>
							<img width={64} height={64} src="./images/welcome.png" alt="Image"/>
						</Media.Left>
						<Media.Body>
							<Media.Heading>Тема {i}</Media.Heading>
							<p>Описание темы {i}</p>
							{
								_.times(5, (i)=>{
									return <Media key={i} onClick={this.handlerClick} className="cursor-pointer">
										<Media.Left>
											<img width={64} height={64} src="./images/welcome.png" alt="Image"/>
										</Media.Left>
										<Media.Body>
											<Media.Heading>Лекция {i}</Media.Heading>
											<p>Описание лекции {i}</p>
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
	handlerClick () {
		this.props.router.push("lecture");
	}
}));