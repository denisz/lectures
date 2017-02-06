var React = require('react');
var _ = require('underscore');
var {Table} = require('react-bootstrap');
var styles = require('../assets/stylesheets/admin.less');

module.exports = React.createClass({
	render () {
		return <div className="b-admin">
					<h3 className="text-center">Результаты</h3>

					<Table responsive>
						<thead>
						<tr>
							<th>#</th>
							<th>Table heading</th>
							<th>Table heading</th>
							<th>Table heading</th>
							<th>Table heading</th>
							<th>Table heading</th>
							<th>Table heading</th>
						</tr>
						</thead>
						<tbody>
						{
							_.times(100, (i)=>{
								return <tr key={i}>
										<td>{i + 1}</td>
										<td>Table cell</td>
										<td>Table cell</td>
										<td>Table cell</td>
										<td>Table cell</td>
										<td>Table cell</td>
										<td>Table cell</td>
									</tr>
							})
						}
						</tbody>
					</Table>
				</div>
	}
})