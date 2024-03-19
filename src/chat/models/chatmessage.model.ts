import mongoose, { Schema, Document } from 'mongoose';

// Define a subdocument schema for the user
const userSchema: Schema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
});

export interface IChatMessage extends Document {
    text: string;
    user: {
        _id: string;
        name: string;
    };
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
}

const chatMessageSchema: Schema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        user: userSchema, // use the user schema here
        roomId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
