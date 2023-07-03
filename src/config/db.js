import mongoose from 'mongoose';

mongoose.connect(process.env.CONNECTION_STRING);

const db = mongoose.connection;

export default db;