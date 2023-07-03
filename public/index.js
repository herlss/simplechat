/* eslint-disable no-undef, no-unused-vars*/
import { emit_erase, emit_msg, select_room } from './socket.front.js';

const params = new URLSearchParams(window.location.search);
const username = params.get('name') || 'Anonymous';
const erase = document.querySelector('.erase');

if (username == 'debug'){
	erase.style.display = 'block';
}

const btn = document.querySelector('.submit-btn');
const topics = document.querySelectorAll('.topic');
const chat_display = document.querySelector('.chat-display');
const input = document.querySelector('#msgText');

var curr_room = 'global';

export function buildMessage({ msg, username, time }){
	chat_display.insertAdjacentHTML('beforeend', `
		<div class='message-wrapper'>
			<div class='message'>${msg}</div>
			<small class="text-muted message-user">Sent by ${username} ● ${time}</small>
		</div>
	`);	

	setTimeout(()=>{},100);

	chat_display.scrollTo(0,chat_display.scrollHeight);
}

function handleMessageSent(){
	const value = input.value;

	if (value.length > 2000){
		window.alert('What are you trying to do? Max. 2000 length.');
		return;
	}

	if (value == ''){
		return;
	}

	emit_msg(value, curr_room.toLowerCase(), username);
	input.value = '';
}

document.body.addEventListener('keydown', (e) => {
	if (e.key == 'Enter' && input === document.activeElement){
		handleMessageSent();
	}
});

btn.addEventListener('click', () => {
	handleMessageSent();
});	

topics.forEach(topic => {
	topic.addEventListener('click', () => {
		chat_display.innerHTML = '';
		curr_room = topic.title;
		document.querySelector('.chat-title').textContent = `${curr_room} Chat`;
		document.querySelector('.connection_room').textContent = `${curr_room} Room`;

		select_room(curr_room.toLowerCase());
	});
});

erase.addEventListener('click', () => {
	emit_erase();
});