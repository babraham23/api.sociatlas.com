import mongoose, { Document, Schema } from 'mongoose';

const InterestSchema = new Schema({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export interface IInterest extends Document {
    icon: string;
    title: string;
    id: number;
    likeCount: number;
    date: Date;
}

export const InterestModel = mongoose.model<IInterest>('Interest', InterestSchema);
