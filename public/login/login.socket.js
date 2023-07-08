/* eslint-disable no-undef, no-unused-vars*/

import { 
	authFailed,
	authSuccess
} from './index.js';

const socket = io();

export async function send_login(payload){
	socket.emit('auth:login', payload);
}

socket.on('authl:failed', authFailed);
socket.on('authl:success', authSuccess);