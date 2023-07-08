import { Message, User } from '../models/index.js';

export async function registerMsgHandlers({ io, socket }){
	const msgSent = async (payload) => {
		var now = new Date();
		var time = now.toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
		payload.time = time;

		const msg = new Message(payload);
		await msg.save();

		await User.updateMany(
			{ 'dms.name': payload.room }, 
			{ $set: { 'dms.$.last': payload.msg } }
		);

		io.of('/users').to(payload.room).emit('msg:received', payload);
	};

	const msgErase = async () => {
		await Message.deleteMany();
	};

	socket.on('msg:sent', msgSent);
	socket.on('msg:erase', msgErase);
}