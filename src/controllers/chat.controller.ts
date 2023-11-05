import { ChatMessageModel } from '../models/chat.model';
import { ChatRoomModel } from '../models/chatroom.model';

type NewMessageData = {
    room_id: string;
    message: string;
    user: string;
    timestamp: {
        hour: number;
        mins: number;
    };
};

const handleSocketConnection = (socket: any, io: any): void => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // Joining a room
    socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
    });

    // Create room
    socket.on('createRoom', async (name: string) => {
        socket.join(name);
        const newRoom = new ChatRoomModel({ name, messages: [] });
        try {
            await newRoom.save();
            socket.emit('roomsList', await ChatRoomModel.find().populate('messages'));
        } catch (error) {
            console.error('Error creating new chat room', error);
        }
    });

    // Find room
    socket.on('findRoom', async (roomId: string) => {
        console.log('🔍: Finding room', roomId);
        try {
            const roomMessages = await ChatMessageModel.find({ roomId }).exec();
            socket.emit('foundRoom', roomMessages);
        } catch (error) {
            console.error('Error fetching messages for room', roomId, error);
        }
    });

    // New message
    socket.on('newMessage', async (data: NewMessageData) => {
        const { room_id, message, user, timestamp } = data;
        const newMessage = new ChatMessageModel({
            text: message,
            user,
            time: `${timestamp.hour}:${timestamp.mins}`,
            roomId: room_id, // this links the message to a specific room
        });
        try {
            await newMessage.save();

            const room = await ChatRoomModel.findById(room_id).populate('messages');
            if (room) {
                room.messages.push(newMessage);
                await room.save();

                // Emit the updated list of messages for the room to everyone in that room
                io.to(room_id).emit('updateMessages', room.messages);

                // This may no longer be necessary if you're updating the messages real-time
                socket.emit('roomsList', await ChatRoomModel.find().populate('messages'));
            } else {
                console.error('Chat room not found!');
            }
        } catch (error) {
            console.error('Error saving message to the database', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
};

const getChatRooms = async (req: any, res: any): Promise<void> => {
    try {
        const rooms = await ChatRoomModel.find().populate('messages');
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching chat rooms', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*
1. Get all contact chat rooms for a specific user
2. Find room when a user clicks on a chat
*/

export { handleSocketConnection, getChatRooms };
