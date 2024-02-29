import mongoose, { Document, Schema } from 'mongoose';

export interface IInterest extends Document {
    createdBy: mongoose.Types.ObjectId | string;
    icon: string;
    image: string;
    title: string;
    selected: number;
    hidden: boolean;
    orderIndex: number;
}

const InterestSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        icon: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        selected: {
            type: Number,
            default: 0,
        },
        hidden: {
            type: Boolean,
            default: false,
        },
        orderIndex: {
            type: Number,
            default: 0,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const InterestModel = mongoose.model<IInterest>('Interest', InterestSchema);
