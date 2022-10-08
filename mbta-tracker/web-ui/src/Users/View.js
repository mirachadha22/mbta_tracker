import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function ViewUser({users, session}) {
	if (session) {
		
		return(
			<div>
				<Row>
					<Col>
						<h1>Show User</h1>
					</Col>
					<div className="col" align="right">
						<Link to="/user/edit">Edit</Link>
					</div>
				</Row>
				<Row>
					<Col>
						<ul>
							<li><strong>Name:</strong> {session.name}</li>
							<li><strong>Email:</strong> {session.email}</li>
							<br />
						</ul>
					</Col>
				</Row>
			</div>
		);
	} else {
		return(
			<Row>
				<h3>Please sign in or register to view your user profile.</h3>
			</Row>
		);
	} 
}

export default connect(({session}) => ({session}))(ViewUser);