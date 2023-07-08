import { User } from '../models/index.js';

export async function registerDmsHandlers({ io, socket }){
	const dmInvite = async ({ username, target }) => {
		if (!await User.exists({ username: target })){
			socket.emit('dms:failed', 'User does not exist');
			return;
		}else if (
			await User.exists({ 'dms.name': `${username}-${target}` }) ||
			await User.exists({ 'dms.name': `${target}-${username}` })
		){
			socket.emit('dms:failed', 'DM already open');
			return;
		}

		const dm = {
			name: `${username}-${target}`,
			users: [ target, username ],
			last: 'Send your first message!'
		};

		await User.updateOne(
			{ username: target }, 
			{ $push: { dms: dm } }
		);

		dm.users = [ username, target ];

		await User.updateOne(
			{ username }, 
			{ $push: { dms: dm } }
		);

		socket.emit('dms:success', dm);
	};

	socket.on('dms:invite', dmInvite);
}