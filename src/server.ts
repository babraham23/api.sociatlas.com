require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import http from 'http';
import socketIO from 'socket.io';
import { handleSocketConnection } from './chat/controllers';

const app = express();

const CONNECTON_STRING = process.env.API_KEY as string;

mongoose.connect(CONNECTON_STRING);

mongoose.connection.once('open', function () {
    console.log('🔥🔥Successfully connected to the database🔥🔥');
});

mongoose.connection.on('error', function () {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('static'));

require('./routes/events.routes.ts')(app);
require('./routes/interests.routes.ts')(app);
require('./routes/user.routes.ts')(app);
require('./routes/friends.routes.ts')(app);
require('./routes/droppin.routes.ts')(app);
require('./chat/routes/chat.routes.ts')(app);  // Moved here

// Chat connection
const server = http.createServer(app);
const PORT: number = 3000;

const io = new socketIO.Server(server, {
    cors: {
        origin: '*', // Set this to the origin of your frontend app
    },
});

// Chat socket connection
io.on('connection', (socket: any) => {
    handleSocketConnection(socket, io);
});

server.listen(PORT, () => {
    console.log(`⚡️⚡️Socket connected on port ${PORT}⚡️⚡️`);
});

export default app;
