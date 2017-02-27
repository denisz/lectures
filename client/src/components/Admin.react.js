var React = require('react');
var _ = require('underscore');
var {Table} = require('react-bootstrap');
var styles = require('../assets/stylesheets/admin.less');
var Results = require('./../services/Table');
var moment = require('moment');
var {Popover, OverlayTrigger, Button, ButtonToolbar} = require('react-bootstrap');
var {ipcRenderer} = require('electron');
var Router = require('./../services/Router');

var ResultsPopover = React.createClass({
	propTypes : {
		items: React.PropTypes.array.isRequired
	},

	render () {
		var items = _.sortBy(this.props.items, "Index");

		return <Popover id="popover-positioned-left" title="Popover left">
					<strong>Results</strong> Check this info.

					<Table responsive>
						<thead>
						<tr>
							<th>Test ID</th>
							<th>Answer</th>
						</tr>
						</thead>
						<tbody>
						{
							items.map((i, idx)=>{
								return <tr key={idx}>
									<td>{i.ID}</td>
									<td>{i.Value}</td>
								</tr>
							})
						}
						</tbody>
					</Table>
				</Popover>
	}
});

module.exports = React.createClass({
	getInitialState () {
		return {
			table: new Results()
		}
	},

	componentWillMount() {
		var table = this.state.table;

		table.fetch().then(()=>{
			this.setState({
				table: table
			})
		})
	},

	handlerExport () {
		var url = Router.exportBy("xlsx").url();
		console.log(url);
		ipcRenderer.send('app-download-documents', {url: url});
	},

	render () {
		var table = this.state.table;

		return <div className="b-admin">
					<h3 className="text-center">Результаты</h3>
					<div>
						<Button onClick={this.handlerExport}>Export xlsx</Button>
					</div>
					<div className="container header">
						<Table responsive>
							<thead>
							<tr>
								<th>#</th>
								<th>User</th>
								<th>Date</th>
								<th>LectureID</th>
								<th>Results</th>
							</tr>
							</thead>
						</Table>
					</div>
					<div className="container">
						<Table responsive>
							<tbody>
							{
								table.map((i, idx)=>{
									return <tr key={idx}>
										<td>{idx + 1}</td>
										<td>{i.User.DisplayName}</td>
										<td>{moment(i.Created).format("DD.MM.YYYY HH:MM")}</td>
										<td>{i.Data.LectureID}</td>
										<td>
											<div style={{ position: "relative" }}>
												<OverlayTrigger
													trigger="click"
													placement="left"
													overlay={<ResultsPopover
														items={i.Data.Answers}/>}>
													<Button>Answers</Button>
												</OverlayTrigger>
											</div>
										</td>
									</tr>
								})
							}
							</tbody>
						</Table>
					</div>
				</div>
	}
});