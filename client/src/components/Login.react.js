var React = require('react');
var _ = require('underscore');
var {Button, Image} = require('react-bootstrap');
var {User} = require('./../services');
var {withRouter, Link} = require('react-router');
var classnames = require('classnames');

import '../assets/stylesheets/login.less';
import '../assets/stylesheets/facebook.less';
import '../assets/stylesheets/twitter.less';
import '../assets/stylesheets/vkontakte.less';

module.exports = withRouter(React.createClass({
	getInitialState () {
		return {
			saved : User.savedUsers()
		}
	},

	render () {
		return 	<div className="b-login">
			<div className="login-wrapper">

				<div className="b-enter-as">
					{
						!_.isEmpty(this.state.saved)
						&& <div className="e-enter-label">Войти как:</div>
					}
					<div className="holder">
						{
							this.state.saved.map((i, idx)=>{
								var className = classnames('e-avatar', {
									'm-fb' : i.provider == 'fb',
									'm-vk' : i.provider == 'vk',
									'm-tw' : i.provider == 'tw',
								});
								return <div onClick={_.bind(this.didTapContinue, this, i)} className={className} key={idx}>
											<Image src={i.picture} alt={i.name} circle/>
										</div>
							})
						}
					</div>
				</div>

				<div className="b-enter-social">
					<hr/>
					<h4>Вход через социальные сети</h4>
					<Button className="twitter-btn" onClick={this.didTapTwitter}>
						<span className="svgIcon"><svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25"><path d="M21.725 5.338c-.744.47-1.605.804-2.513 1.006a3.978 3.978 0 0 0-2.942-1.293c-2.22 0-4.02 1.81-4.02 4.02 0 .32.034.63.07.94-3.31-.18-6.27-1.78-8.255-4.23a4.544 4.544 0 0 0-.574 2.01c.04 1.43.74 2.66 1.8 3.38-.63-.01-1.25-.19-1.79-.5v.08c0 1.93 1.38 3.56 3.23 3.95-.34.07-.7.12-1.07.14-.25-.02-.5-.04-.72-.07.49 1.58 1.97 2.74 3.74 2.8a8.49 8.49 0 0 1-5.02 1.72c-.3-.03-.62-.04-.93-.07A11.447 11.447 0 0 0 8.88 21c7.386 0 11.43-6.13 11.414-11.414.015-.21.01-.38 0-.578a7.604 7.604 0 0 0 2.01-2.08 7.27 7.27 0 0 1-2.297.645 3.856 3.856 0 0 0 1.72-2.23"></path></svg></span>
						<div className="labelSet"><span className="button-label button-label--multiLine js-buttonLabel">Continue with Twitter</span></div>
					</Button>

					<Button className="facebook-btn" onClick={this.didTapFacebook}>
							<span className="svgIcon">
								<svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25"><path d="M21 12.646C21 7.65 16.97 3.6 12 3.6s-9 4.05-9 9.046a9.026 9.026 0 0 0 7.59 8.924v-6.376H8.395V12.64h2.193v-1.88c0-2.186 1.328-3.375 3.267-3.375.93 0 1.728.07 1.96.1V9.77H14.47c-1.055 0-1.26.503-1.26 1.242v1.63h2.517l-.33 2.554H13.21V21.6c4.398-.597 7.79-4.373 7.79-8.954"></path></svg>
							</span>
						<div className="labelSet"><span className="button-label button-label--multiLine js-buttonLabel">Continue with Facebook</span></div>
					</Button>

					<Button className="vk-btn" onClick={this.didTapVkontakte}>
							<span className="svgIcon">
								<svg className="svgIcon-use" width="25" height="25" viewBox="0 0 31 18">
									<path d="M28.0407854,12.621191 C28.0407854,12.621191 30.5868363,15.1383567 31.2169195,16.3021038 C31.2329931,16.327822 31.2426372,16.3471106 31.2458519,16.3567549 C31.5030288,16.7875343 31.5641083,17.1250852 31.4387346,17.3726226 C31.2265637,17.7841133 30.5064685,17.9898586 30.2621505,18.0059325 L25.7615555,18.0059325 C25.4465139,18.0059325 24.7971423,17.9255632 24.0031088,17.3758374 C23.3955285,16.9514876 22.7943776,16.2538823 22.2093002,15.5723508 C21.3381136,14.5596979 20.5826566,13.6820655 19.8175555,13.6820655 C19.7211142,13.6820655 19.6246729,13.6981393 19.534661,13.730287 C18.956013,13.913529 18.223059,14.7365104 18.223059,16.932199 C18.223059,17.62016 17.6797729,18.0091472 17.300437,18.0091472 L15.2398075,18.0091472 C14.5357859,18.0091472 10.8806598,17.7648247 7.63701676,14.3443083 C3.66041966,10.1554616 0.0888761025,1.75526498 0.0567289958,1.68132524 C-0.165086041,1.13802894 0.301047007,0.842270007 0.805756583,0.842270007 L5.35135747,0.842270007 C5.9621525,0.842270007 6.15824985,1.21196867 6.29648241,1.54309009 C6.45721795,1.92243307 7.05193942,3.43980499 8.02921146,5.1468484 C9.61084912,7.92119579 10.5816917,9.05279519 11.3596517,9.05279519 C11.5075284,9.05279519 11.645761,9.01743271 11.7743494,8.94349297 C12.790198,8.38733759 12.60053,4.76429065 12.5523094,4.015249 C12.5523094,3.87058431 12.5523094,2.39821918 12.0315263,1.68454001 C11.6586198,1.17339142 11.0253218,0.974075619 10.6427712,0.903350656 C10.745642,0.755471189 10.9610276,0.527222447 11.2407074,0.395416835 C11.9350849,0.0482215653 13.1920368,0 14.4361298,0 L15.1272926,0 C16.4774711,0.0192886261 16.8278746,0.106087444 17.3197253,0.231463513 C18.3098562,0.469356569 18.3291445,1.109096 18.2423473,3.29192552 C18.2166296,3.9155911 18.1909119,4.61962595 18.1909119,5.44582211 C18.1909119,5.62263451 18.1844825,5.81873554 18.1844825,6.01805135 C18.1555501,7.13679166 18.1137588,8.40019667 18.9045777,8.91777481 C19.0042337,8.98207023 19.123178,9.01421794 19.245337,9.01421794 C19.5185874,9.01421794 20.3415533,9.01421794 22.5661331,5.19506997 C23.5434052,3.50731518 24.2988622,1.51737192 24.3502975,1.36949245 C24.3953035,1.28590841 24.5271066,1.05123012 24.6878422,0.958001764 C24.8100012,0.880847259 24.9739514,0.871202946 25.0607486,0.871202946 L30.4100272,0.871202946 C30.9918898,0.871202946 31.3872992,0.958001764 31.4644523,1.17982096 C31.5930407,1.53666055 31.4387346,2.62968269 28.9987692,5.93125253 C28.5872862,6.48097837 28.2272386,6.95676448 27.9089823,7.37146995 C25.6972613,10.2679786 25.6972613,10.4158581 28.0407854,12.621191 L28.0407854,12.621191 Z" id="Shape" fill="#000000"/>
								</svg>
							</span>
						<div className="labelSet"><span className="button-label button-label--multiLine js-buttonLabel">Continue with Vkontakte</span></div>
					</Button>
				</div>

				<div className="b-footer text-center text-muted">
					<small>Регистрируясь, вы подтверждаете свое согласие с <Link to="rules">правилами пользования</Link></small>
				</div>
			</div>
		</div>
	},

	didTapContinue(user) {
		User.setCurrent(user).then(()=>{
			this.props.router.push("/");
		})
	},

	didTapTwitter () {
		User.loginWithTwitter().then(()=>{
			this.props.router.push("/");
		})
	},

	didTapVkontakte () {
		User.loginWithVkontakte().then(()=>{
			this.props.router.push("/");
		})
	},

	didTapFacebook () {
		User.loginWithFacebook().then(()=>{
			this.props.router.push("/");
		})
	}
}));