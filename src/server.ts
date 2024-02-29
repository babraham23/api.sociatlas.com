import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import http from 'http';
import socketIO from 'socket.io';
import { getChatRooms, handleSocketConnection } from './controllers/chat.controller';

const app = express();

// Configuring the database
const CONNECTON_STRING = 'mongodb+srv://brettabraham23:ODOhf6o5eHQZqvmC@sociatlas.mlt8mpc.mongodb.net/';

mongoose.connect(CONNECTON_STRING);

mongoose.connection.once('open', function () {
    console.log('Successfully connected to the database');
});

mongoose.connection.on('error', function () {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('static'));

// Required routes
require('./routes/events.routes.ts')(app);
require('./routes/interests.routes.ts')(app);
require('./routes/user.routes.ts')(app);
require('./routes/friends.routes.ts')(app);

// Setting up HTTP and WebSocket server on the same port
const server = http.createServer(app);
const PORT: number = 3000;

const io = new socketIO.Server(server, {
    cors: {
        origin: '*', // Set this to the origin of your frontend app
    },
});

io.on('connection', (socket: any) => {
    handleSocketConnection(socket, io);
});

app.get('/api/chatrooms', getChatRooms);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

export default app;
