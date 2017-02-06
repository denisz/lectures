/**
 * Created by deniszaytcev on 5/16/16.
 */

'use strict';

var React 		= require('react');
var {render} 	= require('react-dom');
var bootstrap 	= require('./bootstrap.js');

var App 		= require('./components/App.react.js');
var Dashboard 	= require('./components/Dashboard.react.js');
var Login 		= require('./components/Login.react.js');
var Bootstrap   = require('./components/Bootstrap.react.js');
var Lecture 	= require('./components/Lecture.react.js');
var Lectures 	= require('./components/Lectures.react.js');
var Settings 	= require('./components/Settings.react.js');
var Other 		= require('./components/Other.react.js');
var About 		= require('./components/About.react.js');
var Practice	= require('./components/Practice.react.js');
var Profile		= require('./components/Profile.react.js');
var Test 		= require('./components/Tests.react.js');
var References  = require('./components/References.react.js');
var Tests 		= require('./components/Tests.react.js');
var Menu 		= require('./components/Menu.react.js');
var NotFound 	= require('./components/NotFound.react.js');
var Logout 		= require('./components/Logout.react.js');
var Admin 		= require('./components/Admin.react.js');

import './assets/stylesheets/base.less';

var RSVP = require('rsvp');

RSVP.on("error", function (error) {console.error(error)});

var locale = "en";

var {
	addLocaleData,
	IntlProvider
} = require('react-intl');

var {
	Router,
	Route,
	Redirect,
	IndexRoute,
	IndexRedirect,
	hashHistory,
	browserHistory
} = require('react-router');

var enLocaleData  = require('react-intl/locale-data/en') ;
var ruLocaleData  = require('react-intl/locale-data/ru');

window.app = {
	'en' :  require('./lang/en_US.json'),
	'ru' :  require('./lang/ru_RU.json')
};

addLocaleData([...enLocaleData, ...ruLocaleData]);

bootstrap();

render(
	<IntlProvider locale={locale} messages={window.app[locale]}>
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRedirect to="/dashboard" />

				<Route path="bootstrap" component={Bootstrap} />
				<Route path="login" 	component={Login} />
				<Route path="logout" 	component={Logout} />
				<Route path="settings"  component={Settings} />
				<Route path="dashboard" component={Dashboard}>
					<IndexRedirect to="/menu" />

					<Route path="/admin" 			component={Admin} />
					<Route path="/menu" 			component={Menu} />
					<Route path="/profile" 			component={Profile} />
					<Route path="/tests" 			component={Tests} />
					<Route path="/test"		 		component={Test} />
					<Route path="/test/:id" 		component={Test} />
					<Route path="/lecture"	 		component={Lecture} />
					<Route path="/lecture/:id" 		component={Lecture} />
					<Route path="/references" 		component={References} />
					<Route path="/lectures" 		component={Lectures} />
					<Route path="/practice" 		component={Practice} />
					<Route path="/other" 			component={Other} />
					<Route path="/about" 			component={About} />
				</Route>
			</Route>
			<Route path="*" component={NotFound} />
		</Router>
	</IntlProvider>,
	document.getElementById('app')
);