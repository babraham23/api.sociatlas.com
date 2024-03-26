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
            // Update this to match your updated schema
            _id: user._id,
            name: user.name,
            username: user.username, // New field
            profilePic: user.profilePic, // New field
        },
        roomId: room_id, // this links the message to a specific room
    });

    try {
        await newMessage.save();
    } catch (error) {
        console.error('Error saving message to the database', error);
    }
};

const getLocationChatRoomById = async (socket: any, roomId: string) => {
    console.log('Fetching messages location chat for room', roomId);
    try {
        const roomMessages = await LocationChatMessageModel.find({ roomId }).exec();
        socket.emit('listenForLocationChatRoomMessages', roomMessages);
    } catch (error) {
        console.error('Error fetching messages for room', roomId, error);
    }
};

export { newLocationChatMessageController, getLocationChatRoomById };
