import store from './store';
import * as ch from './socket';

export async function api_get(path) {
	let text = await fetch(process.env.REACT_APP_SERVER_URL + path, {});
	let resp = await text.json();
	return resp.data;
}

async function api_post(path, data) {
	let opts = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	};
	let text = await fetch(process.env.REACT_APP_SERVER_URL + path, opts);
	return await text.json();
}

async function api_send_with_opts(path, opts) {
	let text = await fetch(process.env.REACT_APP_SERVER_URL + path, opts);
	return await text.json();
}

export function api_login(email, password) {
	api_post("/session", {email, password}).then((data) => {
		if (data.session) {
			let action = {
				type: 'session/set',
				data: data.session
			}
			store.dispatch(action);

			let state = store.getState();
    	let email = state?.session?.email;
  		ch.ch_join(email, (st) => {
	  			let action = {
					type: 'update/set',
					data: st.doUpdate
				}
				store.dispatch(action);
  		});

		} else if (data.error) {
			let action = {
				type: 'error/set',
				data: data.error
			}
			store.dispatch(action);
		}
	});
}

export function create_user(user) {
	let data = new FormData();
	data.append("user[name]", user.name);
	data.append("user[email]", user.email);
	data.append("user[password]", user.password);
	
	let opts = {
		method: 'POST',
		body: data
	};

	return api_send_with_opts("/users", opts);
}

export function edit_user(id, user) {
	let data = new FormData();
	data.append("user[name]", user.name);
	data.append("user[email]", user.email);
	data.append("user[password]", user.password);
	data.append("user[password_hash]", user.password_hash);
	
	let opts = {
		method: 'PATCH',
		body: data
	};

	return api_send_with_opts("/users/" + id, opts);
}

export function create_favorite(user_id, location) {
	let data = new FormData();
	data.append("favorite[address]", location.address);
	data.append("favorite[latitude]", location.latitude);
	data.append("favorite[longitude]", location.longitude);
	data.append("favorite[user_id]", user_id);

	let state = store.getState();
	let token = state?.session?.token;
	let opts = {
		method: 'POST',
		headers: {
			'x-auth': token
		},
		body: data
	};

	return api_send_with_opts("/favorites", opts).then((data) => {
		let action = {
			type: 'search/set',
			data: data
		};
		store.dispatch(action);

		fetch_favorites();
	});
}

export function create_search(user_id, search) {
	let data = new FormData();
	data.append("search[address]", search.address);
	data.append("search[latitude]", search.latitude);
	data.append("search[longitude]", search.longitude);
	data.append("search[user_id]", user_id);

	let state = store.getState();
	let token = state?.session?.token;
	let opts = {
		method: 'POST',
		headers: {
			'x-auth': token
		},
		body: data
	};

	api_send_with_opts("/searches", opts).then((data) => {
		let action = {
			type: 'search/set',
			data: data
		};
		store.dispatch(action);

		let action2 = {
			type: 'loadingStatus/set',
			data: false
		};
		store.dispatch(action2);

		fetch_searches();
	});
}

export function updatePredictionInfo(location) {
	let action = {
		type: 'loadingStatus/set',
		data: true
	}
	store.dispatch(action);

	let state = store.getState();
	let token = state?.session?.token;
	let opts = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-auth': token
		},
		body: JSON.stringify(location)
	};

	return api_send_with_opts("/currentLocation", opts).then((data) => {
		let action = {
			type: 'currentLocation/set',
			data: data
		}
		store.dispatch(action);

		let action2 = {
			type: 'loadingStatus/set',
			data: false
		}
		store.dispatch(action2);
	});
}

export function getPredictionInfoForSearch(location) {
	let action = {
		type: 'loadingStatus/set',
		data: true
	}
	store.dispatch(action);

	let state = store.getState();
	let token = state?.session?.token;
	let opts = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-auth': token
		},
		body: JSON.stringify(location)
	};

	api_send_with_opts("/currentLocation", opts).then((data) => {

		data = {
			allInfo: data.allInfo, 
			trainInfo: data.trainInfo, 
			busInfo: data.busInfo,
			latitude: location.latitude,
			longitude: location.longitude
		};
		let action = {
			type: 'view/set',
			data: data
		}
		store.dispatch(action);

		let action2 = {
			type: 'loadingStatus/set',
			data: false
		}
		store.dispatch(action2);
	});
}

export function fetch_users() {
	api_get("/users").then((data) => {
		let action = {
			type: 'users/set',
			data: data
		}
		store.dispatch(action);
	});
}

export function fetch_searches() {
	api_get("/searches").then((data) => {
		let action = {
			type: 'searches/set',
			data: data
		}
		store.dispatch(action);
	});
}

export function fetch_favorites() {
	api_get("/favorites").then((data) => {
		let action = {
			type: 'favorites/set',
			data: data
		}
		store.dispatch(action);
	});
}

export function load_defaults() {
	fetch_users();	
	fetch_searches();
	fetch_favorites();
}