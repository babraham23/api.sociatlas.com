import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationChatRoom extends Document {
    name: string;
    lat: number; // Latitude
    lng: number; // Longitude
    creator: string;
    members: string[];
}

const LocationChatRoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true }, // Latitude field
    lng: { type: Number, required: true }, // Longitude field
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const LocationChatRoomModel = mongoose.model<ILocationChatRoom>('LocationChatRoom', LocationChatRoomSchema);
