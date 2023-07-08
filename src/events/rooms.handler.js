import { Message } from '../models/index.js';

// eslint-disable-next-line no-unused-vars
export async function registerRoomsHandlers({ io, socket }){
	const roomSelected = async (payload) => {
		socket.leaveAll();
		socket.join(payload.room);

		socket.emit('room:populate', await Message.find({ room: payload.room }));
	};

	socket.on('room:selected', roomSelected);
}