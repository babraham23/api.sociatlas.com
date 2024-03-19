import { ChatMessageModel } from '../models/chatmessage.model';
import { ChatRoomModel } from '../models/chatroom.model'; // Update path as needed

const createChatRoom = async (socket: any, name: string, userId: string, friendId: string) => {
    if (!userId || !friendId) {
        console.error('User ID or Friend ID is missing');
        return; // Handle this appropriately
    }

    // Create two possible combinations of userId and friendId
    const identifier1 = `${userId}-${friendId}`;
    const identifier2 = `${friendId}-${userId}`;

    try {
        // Check if a room with these identifiers already exists
        const existingRoom = await ChatRoomModel.findOne({
            identifier: { $in: [identifier1, identifier2] },
        });

        if (existingRoom) {
            console.log('Room already exists, navigating to the room');
            socket.join(existingRoom.name);
            return existingRoom;
        }

        // If room doesn't exist, create a new one with one of the identifiers
        const newRoom = new ChatRoomModel({
            name, // Your original room naming logic
            creator: userId,
            members: [userId, friendId],
            identifier: identifier1, // Use the first identifier as standard
        });

        // socket.join(newRoom.name);
        await newRoom.save();
        // Post-save logic
    } catch (error) {
        console.error('Error creating new chat room', error);
    }
};

// Get messages for a room
const getRoomById = async (socket: any, roomId: string) => {
    console.log('Fetching messages for room', roomId);
    try {
        const roomMessages = await ChatMessageModel.find({ roomId }).exec();
        socket.emit('listenForRoomMessages', roomMessages);
    } catch (error) {
        console.error('Error fetching messages for room', roomId, error);
    }
};

const getUserChatRooms = async (req: any, res: any): Promise<void> => {
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

export { createChatRoom, getUserChatRooms, getRoomById };
