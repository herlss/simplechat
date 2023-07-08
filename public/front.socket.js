/* eslint-disable no-undef, no-unused-vars*/
import { buildDM, buildMessage, populateUserData } from './index.js';
import { getCookie } from './utils/cookies.js';

const socket = io('/users',{
	auth: {
		token: getCookie('jwt-token')
	}
});

export function request_user(token){
	socket.emit('user:data', token);
}

export function select_room(room){
	socket.emit('room:selected', { room });
}

export function emit_msg(msg, room, username) {
	socket.emit('msg:sent', { msg, room, username });
}

export function emit_erase(){
	socket.emit('msg:erase');
}

export function invite_user({ username, target }) {
	socket.emit('dms:invite', { username, target });
}

socket.on('connect_error', () => {
	window.location.href = '/login';
});

socket.on('msg:received', (payload) => {
	buildMessage(payload);
});

socket.on('room:populate', (messages) => {
	messages.forEach(message => {
		buildMessage(message);
	});
});

socket.on('user:data', populateUserData);

socket.on('dms:failed', reason => {
	window.alert(`Invite failed: ${reason}`);
});

socket.on('dms:success', buildDM);