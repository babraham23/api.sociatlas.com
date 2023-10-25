import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model'; // Adjust the path as necessary

interface IChatMessage extends Document {
    message: string;
    sender: IUser['_id'];
    timestamp: Date;
}

const chatMessageSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
export default ChatMessageModel;
