import { ChatMessageModel } from '../chat/models/chatmessage.model';
import { DirectMessageModel } from '../models/directMessage.model';

/*
1. Get messages for a room

Client side:
socket.emit('getRoomById', roomId);
*/
const getRoomById = async (socket: any, roomId: string) => {
    try {
        const roomMessages = await ChatMessageModel.find({ roomId }).exec();
        socket.emit('listenForRoomMessages', roomMessages);
    } catch (error) {
        console.error('Error fetching messages for room', roomId, error);
    }
};

export type NewMessageData = {
    room_id: string;
    message: string;
    user: {
        _id: string;
        name: string;
    };
};

const newDirectMessageController = async (data: NewMessageData) => {
    const { room_id, message, user } = data;

    const newMessage = new ChatMessageModel({
        text: message,
        user: {
            // Ensure this object structure matches your updated schema
            _id: user._id,
            name: user.name,
        },
        roomId: room_id, // this links the message to a specific room
    });

    try {
        await newMessage.save();
    } catch (error) {
        console.error('Error saving message to the database', error);
    }
};

export { getRoomById, newDirectMessageController };
