import { LocationChatMessageModel } from '../models/locationChatMessage.model';

export type NewLocationChatMessageData = {
    room_id: string;
    message: string;
    user: {
        _id: string;
        name: string;
        username: string;
        profilePic: string;
    };
};

const newLocationChatMessageController = async (data: NewLocationChatMessageData) => {
    console.log('New location chat message received:', data);
    const { room_id, message, user } = data;

    const newMessage = new LocationChatMessageModel({
        text: message,
        user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            profilePic: user.profilePic,
        },
        roomId: room_id,
    });

    try {
        await newMessage.save();
    } catch (error) {
        console.error('Error saving message to the database', error);
    }
};

export { newLocationChatMessageController };