import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationChatRoom extends Document {
    name: string;
    location: {
        coordinates: [number, number]; // Array of latitude and longitude
    };
    creator: string;
    members: string[];
}

// Define Location schema for nested location object
const LocationSchema: Schema = new Schema({
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
    },
});

const LocationChatRoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    location: { type: LocationSchema, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const LocationChatRoomModel = mongoose.model<ILocationChatRoom>('LocationChatRoom', LocationChatRoomSchema);
