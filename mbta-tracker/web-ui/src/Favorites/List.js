import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPredictionInfoForSearch } from '../api';

function ViewFavorites({session, favorites}) {

	if (session === null) {
		return (
      <Row>
        <Col>
          <h2>Please register or sign in to see your favorites.</h2>
        </Col>
      </Row>
    );
	} else {
		return(
			<div>
				<Row>
					<div className="col" align="right">
						<Link to="favorites/new">New Favorite</Link>
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
								{favorites.map(f => {

										if (f.user.id === session.user_id) {

											let position = {latitude: f.latitude, longitude: f.longitude};

											let viewButton = (
												<Link to={"/favorites/view/" + f.id} 
															onClick={() => getPredictionInfoForSearch(position)}>
													view
												</Link>
											);

											return(
												<tr key={f.id}>
													<td>{f.address}</td>
													<td>{f.latitude}</td>
													<td>{f.longitude}</td>
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

export default connect(({session, favorites}) => ({session, favorites}))(ViewFavorites);