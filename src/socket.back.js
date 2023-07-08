import 'dotenv/config';
import io from './server.js';
import { Message } from './models/message.model.js';
import { 
	registerMsgHandlers,
	registerRoomsHandlers,
	registerAuthHandler,
	registerDmsHandlers,
} from './events/index.js';
import {
	authenticateUser
} from './middlewares/index.js';

const nspUsers = io.of('/users');

nspUsers.use(authenticateUser);

const usersOnConnection = async (socket) => {
	console.log(`A user connected through id ${socket.id}`);
    
	socket.join('global');
	socket.emit('room:populate', await Message.find({ room: 'global' }));

	registerDmsHandlers({ nspUsers, socket });
	registerMsgHandlers({ io, socket });
	registerRoomsHandlers({ nspUsers, socket });
	registerAuthHandler({ nspUsers, socket });
};
 
const onConnection = async (socket) => {
	registerAuthHandler({ io, socket });
};

io.of('/').on('connection', onConnection);
nspUsers.on('connection', usersOnConnection);