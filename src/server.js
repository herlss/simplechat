import db from './config/db.js';
import express from 'express';
import url from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { User } from './models/index.js';

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 8080;

const cwd = url.fileURLToPath(import.meta.url);
const pdir = path.join(cwd, '../..', 'public');

app.use(express.static(pdir));
app.use(express.json());

app.get('/user/:username', async (req, res) => {
	const user = await User.findOne({ username: req.params.username }, { password: 0 });
	
	res.json(user);
});

httpServer.listen(port, () => {
	console.log(`Listening on port ${port}`);
	console.log(`Serving on port http://localhost:${port}/`);
});

db.on('error', console.log.bind(console, 'Connection Error'));
db.once('open', () => {
	console.log('Database connection established');
});

const io = new Server(httpServer);

export default io;