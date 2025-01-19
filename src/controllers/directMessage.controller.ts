import { ChatMessageModel } from '../chat/models/chatmessage.model';
import { ChatRoomModel } from '../chat/models/chatroom.model';
import { DirectMessageModel } from '../models/directMessage.model'; // We need to switch to this before we

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

/**

Get users Direct Messages

 */

const getUsersDirectMessageRooms = async (req: any, res: any): Promise<void> => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find rooms where the user is a member
        const rooms = await ChatRoomModel.find({ members: userId });

        res.json(rooms);
    } catch (error) {
        console.error('Error fetching chat rooms', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { getRoomById, newDirectMessageController, getUsersDirectMessageRooms };
