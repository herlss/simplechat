/* eslint-disable no-undef, no-unused-vars */
import { 
	emit_erase, 
	emit_msg, 
	request_user, 
	select_room, 
	invite_user
} from './front.socket.js';
import { getCookie, unsetCookie } from './utils/cookies.js';
  
const erase = document.querySelector('.erase');
  
const btn = document.querySelector('.submit-btn');
const topics = document.querySelectorAll('.topic');
const chat_display = document.querySelector('.chat-display');
const input = document.querySelector('#msgText');
const dm_list = document.querySelector('.dm-list');
const pfp = document.querySelector('.profile-picture');
  
var user = {};
var curr_room = 'global';
  
function handleLastMessage(msg) {
	let last = '';
  
	msg.length <= 20 ? (last = msg) : (last = msg.substring(0, 10) + '...');
  
	return last;
}
  
function openDM(item) {
	const user = item.querySelector('.dm-username').textContent;
	chat_display.innerHTML = '';
	curr_room = item.title;
	document.querySelector('.main-title').textContent = user;
	document.querySelector('.connection_room').textContent = `${user} DM`;
  
	select_room(curr_room.toLowerCase());
}
  
export async function populateUserData({ username }) {
	const req = await fetch(`/user/${username}`);
	const res = await req.json();
	user = await res;
	console.log(user);
  
	user.dms.forEach((dm) => {
		buildDM(dm);
	});

	if (user.picture){
		pfp.src = user.picture;
	}
}
  
export function buildDM(dm) {
	const listItem = document.createElement('li');
	listItem.className = 'list-group-item dm-item';
	listItem.title = dm.name;
	listItem.addEventListener('click', () => openDM(listItem));
	listItem.innerHTML = `
		<div class="picture-wrapper">
			<img src="assets/default.jpg" alt="user_pfp" class="dm-picture">
		</div>
		<p class="dm-data">
			<span class='dm-username'>${dm.users[1]}</span>
			<br>
			<small class="text-muted dm-last">${handleLastMessage(dm.last)}</small>
		</p>
	`;
  
	dm_list.appendChild(listItem);
}
  
export function buildMessage({ msg, username, time }) {
	chat_display.insertAdjacentHTML( 'beforeend',`
		<div class='message-wrapper'>
			<div class='message'></div>
			<small class="text-muted message-user">Sent by ${username} ● ${time}</small>
		</div>
	`);

	const messages = document.querySelectorAll('.message');
	messages[messages.length-1].textContent = msg;
  
	document.querySelectorAll('.dm-item').forEach((dm) => {
		if (dm.title == curr_room) {
			dm.querySelector('.dm-last').textContent = handleLastMessage(msg);
		}
	});
  
	setTimeout(() => {}, 100);
  
	chat_display.scrollTo(0, chat_display.scrollHeight);
}
  
function handleMessageSent() {
	const value = input.value;
  
	if (value.length > 2000) {
		window.alert('What are you trying to do? Max. 2000 length.');
		return;
	}
  
	if (value == '') {
		return;
	}
  
	emit_msg(value, curr_room.toLowerCase(), user.username);
	input.value = '';
}
  
window.addEventListener('load', () => {
	request_user(getCookie('jwt-token'));
});
  
document.body.addEventListener('keydown', (e) => {
	if (e.key == 'Enter' && input === document.activeElement) {
		handleMessageSent();
	}
});
  
btn.addEventListener('click', () => {
	handleMessageSent();
});
  
topics.forEach((topic) => {
	topic.addEventListener('click', () => {
		chat_display.innerHTML = '';
		curr_room = topic.title;
		document.querySelector('.main-title').textContent = `${curr_room} Chat`;
		document.querySelector('.connection_room').textContent = `${curr_room} Room`;

		select_room(curr_room.toLowerCase());
	});
});
  
erase.addEventListener('click', () => {
	emit_erase();
});
  
document.querySelector('.invite-btn').addEventListener('click', () => {
	const target = document.querySelector('#invite-name').value;
	const username = user.username;
  
	if (input.length < 1) {
		window.alert('Type something..');
		return;
	} else if (username == target) {
		window.alert('That\'s you..');
		return;
	}
  
	invite_user({ username, target });
});  

document.querySelector('.btn-logout').addEventListener('click', () => {
	unsetCookie('jwt-token');
	window.location.href = '/login';
});