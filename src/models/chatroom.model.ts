// models/chatRoom.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IChatRoom extends Document {
    name: string;
    messages: any[];
}

const ChatRoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],
});

export const ChatRoomModel = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
