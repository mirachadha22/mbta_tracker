import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import store from '../store';

import { create_user, api_login, fetch_users } from '../api';

function NewUser() {
	let history = useHistory();
	const [user, setUser] = useState({
		name: "", 
		email: "", 
		password: "", 
		passwordCheck: ""
	});

	function check_password(pass1, pass2) {
		if (pass1.length < 10) {
			return "Password is too short.";
		}

		if (pass1 !== pass2) {
			return "Passwords don't match.";
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
		let data = pick(user, ['name', 'email', 'password']);
		create_user(data).then((data) => {
			if (data.error) {
				let action = {
					type: 'error/set',
					data: data.error
				}
				store.dispatch(action);
			} else {
				fetch_users();
				api_login(user['email'], user['password']);
				history.push("/");
			}
		});
	}

	return (
		<Row>
			<Col>
				<h1><b>New User</b></h1>
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
									type="submit"
									disabled={user.pass_msg !== ""}>
						Save
					</Button>
				</Form>
			</Col>
		</Row>
	);
}

function state2props() {
	return {};
}

export default connect(state2props)(NewUser);