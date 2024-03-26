import mongoose, { Schema, Document } from 'mongoose';

const userSchema: Schema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true }, // Assuming usernames are unique
    profilePic: { type: String, required: false }, // Optional field for profile picture URL
});

export interface ILocationChatMessage extends Document {
    text: string;
    user: {
        _id: string;
        name: string;
        username: string;
        profilePic: string;
    };
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
}

const locationChatMessageSchema: Schema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        user: userSchema, // use the user schema here
        roomId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const LocationChatMessageModel = mongoose.model<ILocationChatMessage>('LocationChatMessage', locationChatMessageSchema);
