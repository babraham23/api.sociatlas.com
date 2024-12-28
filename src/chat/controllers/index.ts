import { createChatRoom, getRoomById } from './chatroom.controller';
import { NewMessageData, newMessageController } from './chatmessage.controller';
import { getLocationChatRoomById } from './locationChatroom.controller';
import { newLocationChatMessageController, NewLocationChatMessageData } from '../../controllers/LocationChatMessage.controller';

const handleSocketConnection = (socket: any, io: any): void => {
    console.log(`🔌🔌🔌🔌 Socket Live ${socket.id}`);

    //  ---------- Joining a room ----------
    socket.on('joinRoom', (roomId: string) => {
        console.log('📥 joinRoom called:', { roomId, socketId: socket.id });
        socket.join(roomId);
    });

    //  ---------- Create room ----------
    socket.on('createRoom', (name: string, userId: string, friendId: string) => {
        console.log('🏗️ createRoom called:', { name, userId, friendId, socketId: socket.id });
        createChatRoom(socket, name, userId, friendId);
    });

    // ---------- Get room by id ----------
    socket.on('getRoomById', async (roomId: string) => {
        console.log('🔍 getRoomById called:', { roomId, socketId: socket.id });
        getRoomById(socket, roomId);
    });

    //  ---------- New message ----------
    socket.on('newMessage', async (data: NewMessageData) => {
        console.log('💬 newMessage called:', { data, socketId: socket.id });
        newMessageController(data);
    });

    // ---------- Get locatoin chat room by id ----------
    socket.on('getLocationChatRoomById', async (roomId: string) => {
        console.log('📍 getLocationChatRoomById called:', { roomId, socketId: socket.id });
        getLocationChatRoomById(socket, roomId);
    });

    // ---------- New location message ----------
    socket.on('newlocationChatMessage', async (data: NewLocationChatMessageData) => {
        console.log('📍💬 newLocationChatMessage called:', { data, socketId: socket.id });
        newLocationChatMessageController(data);
    });

    // ---------- Leave room ----------
    socket.on('leaveRoom', (roomId: string) => {
        console.log('📤 leaveRoom called:', { roomId, socketId: socket.id });
        socket.leave(roomId);
    });

    // ---------- Disconnect ----------
    socket.on('disconnect', () => {
        console.log('🔥 disconnect called:', { socketId: socket.id });
    });
};

export { handleSocketConnection };
