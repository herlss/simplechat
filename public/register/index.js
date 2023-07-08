/* eslint-disable no-undef */
import { setCookie, getCookie } from '../utils/cookies.js';
import { send_register } from './register.socket.js';

if (getCookie('jwt-token')){
	window.location.href = '/';
}

export function authFailed({ msg }) {
	window.alert(`Auth failed. Reason: ${msg}`);
}

export function authSuccess(token) {
	setCookie('jwt-token', token);

	window.location.href = '/';
}

const form = document.querySelector('.form-group');

form.addEventListener('submit', e => {
	e.preventDefault();

	const username = form['username'].value;
	const password = form['password'].value;
	let validation = null;

	if (password.length < 1 || username.length < 1){
		validation = 'One or more fields are empty';
	}else if (username.length < 3 || password.length < 3){
		validation = 'All fields must be atleast 3 characters +';
	}

	if (validation) {
		window.alert(validation);
		return;
	}

	send_register({ username, password });
});