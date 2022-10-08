import { createStore, combineReducers } from 'redux';

function session(state = load_session(), action) {
	switch (action.type) {
		case 'session/set':
			save_session(action.data);
			return action.data;
		case 'session/clear':
			save_session(null);
			return null;
		default: 
			return state;
	}
}

function error(state = null, action) {
	switch (action.type) {
		case 'session/set':
			return null;
		case 'error/set':
			return action.data;
		default:
			return state;
	}
}

function save_session(sess) {
	if (sess) {
		let session = Object.assign({}, sess, {time: Date.now()});
		localStorage.setItem("session", JSON.stringify(session));
	} else {
		localStorage.setItem("session", null);
	}
}

function load_session() {
	let session = localStorage.getItem("session");
	if (session === "null" || session == null) {
		return null;
	}
	session = JSON.parse(session);
	let age = Date.now() - session.time;
	let hours = 60*60*1000;
	if (age < 24 * hours) {
		return session;
	} else {
		return null;
	}
}

function search(state = [], action) {
	if (action.type === 'search/set') {
		return action.data;
	} else {
		return state;
	}
}

function view(state = [], action) {
	if (action.type === 'view/set') {
		return action.data;
	} else {
		return state;
	}
}

function searches(state = load_searches(), action) {
	if (action.type === 'searches/set') {
		save_searches(action.data);
		return action.data;
	} else {
		if (state == null) {
			return [];
		} else {
			return state;
		}
	}
}

function load_searches() {
	let searches = localStorage.getItem("searches");
	return JSON.parse(searches);
}

function save_searches(searches) {
	localStorage.setItem("searches", JSON.stringify(searches));
}

function currentLocation(state = [], action) {
	if (action.type === 'currentLocation/set') {
		return action.data;
	} else {
		if (state == null) {
			return [];
		} else {
			return state;
		}
	}
}

function loadingStatus(state = false, action) {
	if (action.type === 'loadingStatus/set') {
		return action.data;
	} else {
		return state;
	}
}

function homeTab(state = 0, action) {
	if (action.type === 'homeTab/set') {
		return action.data;
	} else {
		return state;
	}
}

function doUpdate(state = true, action) {
	if (action.type === 'update/set') {
		return action.data;
	} else {
		return state;
	}
}

function favorites(state = load_favorites(), action) {
	if (action.type === 'favorites/set') {
		save_favorites(action.data);
		return action.data;
	} else {
		if (state == null) {
			return [];
		} else {
			return state;
		}
	}
}

function load_favorites() {
	let favorites = localStorage.getItem("favorites");
	return JSON.parse(favorites);
}

function save_favorites(favorites) {
	localStorage.setItem("favorites", JSON.stringify(favorites));
}

function root_reducer(state, action) {
	let redu = combineReducers({
		session,
		error,
		searches,
		currentLocation,
		loadingStatus,
		homeTab,
		search,
		doUpdate,
		view,
		favorites
	});

	let newState = redu(state, action);

	return newState;
}

let store = createStore(root_reducer);
export default store;