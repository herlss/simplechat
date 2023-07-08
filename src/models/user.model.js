import mongoose from 'mongoose';

const dmSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'DM name is required']
	},
	users: {
		type: [String]
	},
	last: {
		type: String
	}
});

const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required']
		},
		password: {
			type: String,
			required: [true, 'Password is required']
		},
		dms: {
			type: [dmSchema],
		}
	},
	{
		versionKey: false
	}
);

export const User = mongoose.model('users', schema);
