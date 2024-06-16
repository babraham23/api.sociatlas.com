import mongoose, { Document, Schema } from 'mongoose';

export interface IDroppin extends Document {
    droppin: string;
    image?: string;
    icon?: string;
    title?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

const DroppinSchema = new Schema(
    {
        droppin: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

export const DroppinModel = mongoose.model<IDroppin>('Droppin', DroppinSchema);
