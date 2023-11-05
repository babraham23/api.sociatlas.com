import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    text: string;
    user: string;
    time: string;
    roomId: string;
}

const chatMessageSchema: Schema = new mongoose.Schema({
    text: String,
    user: String,
    time: String,
    roomId: String, // this will reference the specific chat room
});

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
