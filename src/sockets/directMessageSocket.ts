import { getRoomById, newDirectMessageController, NewMessageData } from '../controllers/directMessage.controller';

const DirectMessageSocket = (socket: any, io: any): void => {
    console.log(`🔌🔌🔌🔌 Direct Message Socket Live ${socket.id}`);

    // ---------- Get room by id ----------
    socket.on('getRoomById', async (roomId: string) => {
        console.log('🔍 getRoomById called:', { roomId, socketId: socket.id });
        getRoomById(socket, roomId);
    });

    //  ---------- New message ----------
    socket.on('newMessage', async (data: NewMessageData) => {
        console.log('💬 newMessage called:', { data, socketId: socket.id });
        newDirectMessageController(data);
    });
};

export { DirectMessageSocket };
