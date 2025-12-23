import { getRoomById, newDirectMessageController, NewMessageData } from '../controllers/directMessage.controller';

const DirectMessageSocket = (socket: any, io: any): void => {
    console.log(`🔌🔌🔌🔌 Direct Message Socket Live ${socket.id}`);

    // ---------- Get room by id ----------
    socket.on('getRoomById', async (roomId: string) => {
        getRoomById(socket, roomId);
    });

    //  ---------- New message ----------
    socket.on('newMessage', async (data: NewMessageData) => {
        console.log('💬 newMessage called:', { data, socketId: socket.id });
        newDirectMessageController(data);
    });

    // 1. Create DM chat room - 2 Create Location chat room


    // 2. Get all DM chat rooms
};

export { DirectMessageSocket };
