import { ChatMessageModel } from '../models/chatmessage.model';

export type NewMessageData = {
    room_id: string;
    message: string;
    user: {
        _id: string;
        name: string;
    };
};

const newMessageController = async (data: NewMessageData) => {
    console.log('New message received:', data);
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

export { newMessageController };
