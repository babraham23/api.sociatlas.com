import { createChatRoom, getRoomById } from './chatroom.controller';
import { NewMessageData, newMessageController } from './chatmessage.controller';
import { NewLocationChatMessageData, newLocationChatMessageController } from './LocationChatMessage.controller';
import { getLocationChatRoomById } from './locationChatroom.controller';

const handleSocketConnection = (socket: any, io: any): void => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //  ---------- Joining a room ----------
    socket.on('joinRoom', (roomId: string) => {
        console.log('Is this even needed? - ', roomId);
        socket.join(roomId);
    });

    //  ---------- Create room ----------
    socket.on('createRoom', (name: string, userId: string, friendId: string) => {
        createChatRoom(socket, name, userId, friendId);
    });

    // ---------- Get room by id ----------
    socket.on('getRoomById', async (roomId: string) => {
        getRoomById(socket, roomId);
    });

    //  ---------- New message ----------
    socket.on('newMessage', async (data: NewMessageData) => {
        newMessageController(data);
    });

    // ---------- Get locatoin chat room by id ----------
    socket.on('getLocationChatRoomById', async (roomId: string) => {
        getLocationChatRoomById(socket, roomId);
    });

    // ---------- New location message ----------
    socket.on('newlocationChatMessage', async (data: NewLocationChatMessageData) => {
        newLocationChatMessageController(data);
    });

    // ---------- Disconnect ----------
    socket.on('disconnect', () => {
        // console.log('🔥: A user disconnected');
    });
};

export { handleSocketConnection };
