/* eslint-disable no-undef, no-unused-vars*/

import { 
	authFailed,
	authSuccess
} from './index.js';

const socket = io();

export async function send_register(payload){
	socket.emit('auth:register', payload);
}

socket.on('authr:failed', authFailed);
socket.on('authr:success', authSuccess);