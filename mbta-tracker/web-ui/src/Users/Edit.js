import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { edit_user, fetch_users } from '../api';

function EditUser({session}) {
	let history = useHistory();

	const [user, setUser] = useState({
		name: session ? session.name : "",
		email: session ? session.email : "",
		password: "",
		passwordCheck: "",
		password_hash: session ? session.password_hash : "",
	});

	function check_password(pass1, pass2) {
		
		if (user.password !== "") {
			if (pass1 !== pass2) {
				return "Passwords don't match.";
			}
		}

		return "";
	}

	function update(field, ev) {
		let newUser = Object.assign({}, user);
		newUser[field] = ev.target.value;
		newUser.pass_msg = check_password(newUser.password, newUser.passwordCheck);
		setUser(newUser);
	}

	function onSubmit(ev) {
		ev.preventDefault();
		edit_user(session.user_id, user).then((data) => {		
			fetch_users();
			history.push("/user/view");
		});
	}

	if (session) {

		return (
			<Row>
				<Col>
					<h1><b>Edit User</b></h1>
					<Form onSubmit={onSubmit}>
						<Form.Group>
							<Form.Label>Name</Form.Label>
							<Form.Control type="text"
														onChange={(ev) => update("name", ev)}
														value={user.name || ""} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control type="email"
														onChange={(ev) => update("email", ev)}
														value={user.email || ""} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control type="password"
														onChange={(ev) => update("password", ev)}
														value={user.password || ""} />
							<p style={{color: 'red'}}>{user.pass_msg}</p>
						</Form.Group>
						<Form.Group>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control type="password"
														onChange={(ev) => update("passwordCheck", ev)}
														value={user.passwordCheck || ""} />
						</Form.Group>
						<br />
						<Button variant="primary"
										type="submit">
							Save
						</Button>
					</Form>
				</Col>
			</Row>
		);
	} else {
		return(
			<Row>
				<h2>Please sign in or register to edit your user profile.</h2>
			</Row>
		);
	}
}

export default connect(({session}) => ({session}))(EditUser);
