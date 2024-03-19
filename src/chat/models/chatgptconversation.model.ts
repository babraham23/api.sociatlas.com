import mongoose, { Document, Schema } from 'mongoose';

const ChatGPTMessageSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    // Add any additional fields you need, for example:
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export interface IChatGPTMessage extends Document {
    content: string;
    createdAt: Date;
}

export const ChatGPTMessageModel = mongoose.model<IChatGPTMessage>('ChatGPTMessage', ChatGPTMessageSchema);
