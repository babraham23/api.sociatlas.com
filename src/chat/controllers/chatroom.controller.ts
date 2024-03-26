import { ChatMessageModel } from '../models/chatmessage.model';
import { ChatRoomModel } from '../models/chatroom.model'; // Update path as needed
import { LocationChatRoomModel } from '../models/locationChatroom.model';

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
            // Return a message and the existing room's ID
            return {
                message: 'Room already exists',
                roomId: existingRoom._id,
            };
        }

        // If room doesn't exist, create a new one with one of the identifiers
        const newRoom = new ChatRoomModel({
            name, // Your original room naming logic
            creator: userId,
            members: [userId, friendId],
            identifier: identifier1, // Use the first identifier as standard
        });

        await newRoom.save();
        // Post-save logic like joining the room
        socket.join(newRoom.name);
        // You may also return the new room details here, if needed
    } catch (error) {
        console.error('Error creating new chat room', error);
    }
};

// Get messages for a room
const getRoomById = async (socket: any, roomId: string) => {
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

const createLocationChatRoom = async (req: any, res: any) => {
    const { name, lat, lng, creatorId, members } = req.body;

    if (!lat || !lng) {
        console.error('Latitude or Longitude is missing');
        return res.status(400).send('Latitude or Longitude is missing');
    }

    if (!creatorId || members.length === 0) {
        console.error('Creator ID or members list is missing');
        return res.status(400).send('Creator ID or members list is missing');
    }

    try {
        // Check if a room with this latitude and longitude already exists
        const existingRoom = await LocationChatRoomModel.findOne({
            lat,
            lng,
        });

        if (existingRoom) {
            console.log('Room already exists at this location.');
            return res.status(400).json({ message: 'Room already exists at this location' });
        }

        // If room doesn't exist, create a new one
        const newRoom = new LocationChatRoomModel({
            name,
            lat,
            lng,
            creator: creatorId,
            members: members,
        });

        await newRoom.save();
        res.status(201).json(newRoom); // Send the new room details as a response
    } catch (error) {
        console.error('Error creating new location chat room', error);
        res.status(500).send('Internal Server Error');
    }
};

export { createChatRoom, getUserChatRooms, getRoomById, createLocationChatRoom };
