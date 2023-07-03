import 'dotenv/config';
import io from './server.js';
import { Message } from './models/index.js';

io.on('connection', async (socket) => {
	console.log(`A user connected through id ${socket.id}`);
	socket.join('global');
	socket.emit('populate_room', await Message.find({ room: 'global' }));

	socket.on('msg_sent', async payload => {
		var now = new Date();
		var time = now.toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
		payload.time = time;

		const msg = new Message(payload);
		await msg.save();

		io.to(payload.room).emit('msg_received', payload);
	});

	socket.on('room_selected', async payload => {
		socket.leaveAll();
		socket.join(payload.room);

		socket.emit('populate_room', await Message.find({ room: payload.room }));
	});	

	socket.on('erase', async () => {
		await Message.deleteMany();
	});

	socket.on('disconnect', (reason) => {
		console.log(`User ${socket.id} disconnected. Reason: ${reason}\n`);
	});
});