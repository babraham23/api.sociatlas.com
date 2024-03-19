import mongoose, { Schema, Document } from 'mongoose';

export interface IChatRoom extends Document {
    name: string;
    creator: string;
    members: string[];
    identifier: string; // New field to store the combined userId and friendId
}

const ChatRoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    identifier: { type: String, required: true, unique: true }, // Ensure it's unique
});

export const ChatRoomModel = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
