import db from './config/db.js';
import express from 'express';
import url from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 8080;

const cwd = url.fileURLToPath(import.meta.url);
const pdir = path.join(cwd, '../..', 'public');

app.use(express.static(pdir));

httpServer.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

db.on('error', console.log.bind(console, 'Connection Error'));
db.once('open', () => {
	console.log('Database connection established');
});

const io = new Server(httpServer);

export default io;