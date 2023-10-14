import mongoose, { Document, Schema } from 'mongoose';

export interface IInterest extends Document {
    createdBy: mongoose.Types.ObjectId | string;
    icon: string;
    image: string;
    interest: string;
    selected: number;
}

const InterestSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming you have a User model
    },
    icon: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        required: false,
    },
    interest: {
        type: String,
        required: true,
    },
    selected: {
        type: Number,
        default: 0,
    },
});

export const InterestModel = mongoose.model('Interest', InterestSchema);
