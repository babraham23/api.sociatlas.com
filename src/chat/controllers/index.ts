import { createChatRoom, getRoomById } from './chatroom.controller';
import { NewMessageData, newMessageController } from './chatmessage.controller';

const handleSocketConnection = (socket: any, io: any): void => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //  ---------- Joining a room ----------
    socket.on('joinRoom', (roomId: string) => {
        console.log('Joining room', roomId);
        socket.join(roomId);
    });

    //  ---------- Create room ----------
    socket.on('createRoom', (name: string, userId: string, friendId: string) => {
        console.log('Create room', name, userId, friendId);
        createChatRoom(socket, name, userId, friendId);
    });

    // ---------- Get room by id ----------
    socket.on('getRoomById', async (roomId: string) => {
        console.log('Get room by id', roomId);
        getRoomById(socket, roomId);
    });

    //  ---------- New message ----------
    socket.on('newMessage', async (data: NewMessageData) => {
        console.log('New message received', data);
        newMessageController(data);
    });

    // ---------- Disconnect ----------
    socket.on('disconnect', () => {
        // console.log('🔥: A user disconnected');
    });
};

export { handleSocketConnection };
