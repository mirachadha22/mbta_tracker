import { Nav, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { NavLink, Link, useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';
import { api_login } from './api';
import store from './store';

function LoginForm() {
	const location = useLocation();
	let history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function on_submit(ev) {
		ev.preventDefault();
		api_login(email, password);
		if (location.pathname.includes("register")) {
			history.push("/");
		}
	}

	return (
		<Form onSubmit={on_submit} inline>
			Email:&nbsp;
			<Form.Control name="email" 
										type="text" 
										onChange={(ev) => setEmail(ev.target.value)}
										value={email} /> &emsp;
			Password:&nbsp;
			<Form.Control name="password"
										type="password"
										onChange={(ev) => setPassword(ev.target.value)}
										value={password} /> &emsp;
			<Button variant="primary" type="submit">Login</Button>
		</Form>
	);
}

function SessionInfo({session}) {

	function logout(ev) {
		ev.preventDefault();
		store.dispatch({type: 'session/clear'});
	}

	return (
		<div>
			<button className="btn-link" style={{color: 'black'}} disabled>User:</button>
			&ensp;<Link to="/user/view">{session.name}</Link>&ensp;|&ensp; 
			<button className="btn-link" onClick={logout}>Logout</button>
		</div>
	);
}


function UserInfo({session}) {
	if (session) {
		return <SessionInfo session={session} />;
	} else {
		return <LoginForm />;
	}
}

const LoginOrInfo = connect(({session}) => ({session}))(UserInfo);

function ShowRegister({session}) {
	if (!session) {
		return (
			<Col md="auto">
				<Link to="/register">Register</Link>
			</Col>
		);
	} else {
		return (null);
	}
}

const DisplayRegister = connect(({session}) => ({session}))(ShowRegister);

function AppNav({error}) {
	let error_row = null;

	if (error) {
		error_row = (
			<Row>
				<Col>
					<Alert variant="danger">{error}</Alert>
				</Col>
			</Row>
		);
	}

	return(
		<div>
			<Row>
				<Col md={4}>
					<Nav variant="pills">
						<Nav.Item>
							<NavLink to="/" exact className="nav-link" activeClassName="active">
								Home
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink to="/searches" exact className="nav-link" activeClassName="active">
								Searches
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink to="/favorites" exact className="nav-link" activeClassName="active">
								Favorites
							</NavLink>
						</Nav.Item>
					</Nav>
				</Col>
				<div className="col" align="right">
					<LoginOrInfo />
				</div>
				<DisplayRegister />
			</Row>
			<br />
			{error_row}
		</div>
	);
}

export default connect(({error}) => ({error}))(AppNav);