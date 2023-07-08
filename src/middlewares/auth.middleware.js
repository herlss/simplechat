import jwt from 'jsonwebtoken';

export function authenticateUser(socket, next){
	try {
		const token = socket.handshake.auth.token;

		const payload = jwt.verify(token, process.env.JWT_SECRET);

		next();
		socket.emit('user:data', payload);
	}
	catch (err) {
		next(err); 
	}
}