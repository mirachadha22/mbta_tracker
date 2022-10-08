import { Socket } from "phoenix";

let socket = new Socket(
	"wss://mbta-api.zialynnanderson.site/socket", 
	{params: {token: ""}}
);
socket.connect();

let channel = null;

let state = {
	doUpdate: false
};

let callback = null;

function state_update(newState) {
	state = newState;
	if (callback) {
		callback(newState);
	}
}

export function ch_join(email, cb) {
	callback = cb;
	callback(state);

	channel = socket.channel("session:" + email, {});
	channel.join()
	  .receive("ok", state_update)
	  .receive("error", resp => { 
	  	console.log("Unable to join", resp) 
  	});
	channel.on("view", state_update);
	ch_ready();
}

export function ch_ready() {
	channel.push("ready", {})
		.receive("ok", state_update)
    .receive("error", resp => {
       console.log("Unable to push", resp)
     });
}



