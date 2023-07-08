import jwt from 'jsonwebtoken';

export function generate_jwt({ username, }){
	const token = jwt.sign({ username }, process.env.JWT_SECRET, {
		expiresIn: '1h'
	});

	return token;
}