import mongoose from 'mongoose';

const schema = new mongoose.Schema(
	{
		msg: { 
			type: String, required: [true, 'The content of the message is required'] 
		},
		username: { 
			type: String, 
			required: [true, 'Username is required'] 
		},
		time: { 
			type: String, 
			required: [true, 'The time of the message is required']
		},
		room: { 
			type: String,
			required: [true, 'The room of the message is required']
		}
	},
	{
		versionKey: false
	}
);

export const Message = mongoose.model('messages', schema);