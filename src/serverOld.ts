import { getChatRooms, handleSocketConnection } from './controllers/chat.controller';

const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// require('dotenv').config()
const http = require('http');
const socketIO = require('socket.io');

// create express app
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

// headers for future use
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,access-key,Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(express.static('static'));

// Required routes
require('./routes/events.routes.ts')(app);
require('./routes/interests.routes.ts')(app);
require('./routes/user.routes.ts')(app);

// Chat server
const server = http.createServer(app);
const PORT: number = 4000;
const io = new socketIO.Server(server, {
    cors: {
        origin: CONNECTON_STRING,
    },
});
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
io.on('connection', (socket: any) => {
    handleSocketConnection(socket, io);
});
app.get('/api/chatrooms', getChatRooms);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port 3000');
});

module.exports = app;

// ODOhf6o5eHQZqvmC



