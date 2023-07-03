import { buildMessage } from './index.js';

/* eslint-disable no-undef, no-unused-vars*/
		
const socket = io();

export function select_room(room){
	socket.emit('room_selected', { room });
}

export function emit_msg(msg, room, username) {
	socket.emit('msg_sent', { msg, room, username});
}

export function emit_erase(){
	socket.emit('erase');
}

socket.on('msg_received', (payload) => {
	buildMessage(payload);
});

socket.on('populate_room', (messages) => {
	messages.forEach(message => {
		buildMessage(message);
	});
});