import * as argon2 from 'argon2';
import { User } from '../models/index.js';
import { generate_jwt } from '../utils/jwt.js';

// eslint-disable-next-line no-unused-vars
export async function registerAuthHandler({ io, socket }){
	const userRegistered = async ({ username, password }) => {
		try {
			if (await User.exists({ username })) {
				socket.emit('authr:failed', { msg: 'User exists' });
				return;
			}

			const user = new User({
				username,
				password: await argon2.hash(password)
			});
	
			await user.save();

			const token = generate_jwt(user);
			socket.emit('authr:success', token);
		}
		catch (err) {
			console.log(err);
			socket.emit('authr:failed', { msg: 'Internal Server Error' });
		}
	};

	const userLogin = async ({ username, password }) => {
		try {
			const user = await User.findOne({ username });
	
			if (!user) {
				socket.emit('authl:failed', { msg: 'User does not exist' });
				return;
			}
	
			const verify = await argon2.verify(user.password, password);
	
			if (!verify) {
				socket.emit('authl:failed', { msg: 'Password is incorrect' });
				return;
			}

			const token = generate_jwt(user);
			socket.emit('authl:success', token);
		}
		catch (err) {
			console.log(err);
			socket.emit('authl:failed', { msg: 'Internal Server Error' });
		}
	};

	socket.on('auth:login', userLogin);
	socket.on('auth:register', userRegistered);
}