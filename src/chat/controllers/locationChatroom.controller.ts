import { LocationChatMessageModel } from '../models/locationChatMessage.model';
import { LocationChatRoomModel } from '../models/locationChatroom.model';

const createLocationChatRoom = async (req: any, res: any) => {
    console.log('Creating new location chat room', req.body);
    const { name, location, creatorId, members } = req.body;

    // Basic validation
    if (!location || !location.coordinates) {
        return res.status(400).send('Location coordinates are missing');
    }

    if (!creatorId || !members || members.length === 0) {
        return res.status(400).send('Creator ID or members list is missing');
    }

    try {
        // Check if a room with this name and location already exists
        const existingRoom = await LocationChatRoomModel.findOne({
            name: name,
            'location.coordinates': location.coordinates,
        });

        if (existingRoom) {
            return res.status(200).send({ message: 'Room already exists at this location', room: existingRoom });
        }

        // If room doesn't exist, create a new one
        const newRoom = new LocationChatRoomModel({
            name,
            location,
            creator: creatorId,
            members,
        });

        await newRoom.save();

        // Respond with created room
        return res.status(201).send(newRoom);
    } catch (error) {
        console.error('Error creating new location chat room', error);
        return res.status(500).send('Error creating new location chat room');
    }
};

// Get messages for a room
const getLocationChatRoomById = async (socket: any, roomId: string) => {
    try {
        const roomMessages = await LocationChatMessageModel.find({ roomId }).exec();
        socket.emit('listenForLocationChatRoomMessages', roomMessages);
    } catch (error) {
        console.error('Error fetching messages for room', roomId, error);
    }
};

const getLocationChatRooms = async (req: any, res: any) => {
    const { lat, lng, distance } = req.body;

    if (lat == null || lng == null || distance == null) {
        return res.status(400).send('Latitude, Longitude, and Distance are required');
    }

    try {
        const query = {
            'location.coordinates': {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: distance, // Ensure this is in meters if your distance input is in another unit
                },
            },
        };

        const chatRooms = await LocationChatRoomModel.find(query);

        res.status(200).json(chatRooms);
    } catch (error) {
        console.error('Error fetching location chat rooms:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { createLocationChatRoom, getLocationChatRooms, getLocationChatRoomById };
