import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPredictionInfoForSearch } from '../api';

function ViewSearches({session, searches}) {

	if (session === null) {
		return (
      <Row>
        <Col>
          <h2>Please register or sign in to search an address.</h2>
        </Col>
      </Row>
    );
	} else {
		return(
			<div>
				<Row>
					<div className="col" align="right">
						<Link to="searches/new">New Search</Link>
					</div>
				</Row>
				<br />
				<Row>
					<Col>
						<table className="table">
							<thead>
								<tr>
									<th>Address</th>
									<th>Latitude</th>
									<th>Longitude</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{searches.map(s => {
										if (s.user.id === session.user_id) {

											let position = {latitude: s.latitude, longitude: s.longitude};

											let viewButton = (
												<Link to={"/searches/view/" + s.id} 
															onClick={() => getPredictionInfoForSearch(position)}>
													view
												</Link>
											);

											return(
												<tr key={s.id}>
													<td>{s.address}</td>
													<td>{s.latitude}</td>
													<td>{s.longitude}</td>
													<td>{viewButton}</td>
												</tr>
											);
										} else {
											return null;
										}
									})
								}
							</tbody>
						</table>
					</Col>
				</Row>
			</div>
		);
	}
}

export default connect(({session, searches}) => ({session, searches}))(ViewSearches);