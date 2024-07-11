import mongoose, { Document, Schema } from 'mongoose';

export interface IDroppin extends Document {
    title: string;
    description: string;
    date: number;
    coords: {
        address: string;
        coordinates: [number, number];
    };
    droppin: string;
    createdBy: {
        _id: string;
        name: string;
        username: string;
    };
    interests: Array<{
        _id: string;
        icon: string;
        image: string;
        title: string;
        hidden: boolean;
    }>;
}

const InterestSchema = new Schema({
    _id: Schema.Types.Mixed,
    icon: String,
    image: String,
    title: String,
    hidden: Boolean,
});

const CoordsSchema = new Schema({
    address: String,
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
    },
});

const CreatorSchema = new Schema({
    _id: String,
    name: String,
    username: String,
});

const DroppinSchema = new Schema({
    title: String,
    description: String,
    date: Number,
    coords: { type: CoordsSchema, required: true },
    droppin: String,
    createdBy: CreatorSchema,
    interests: [InterestSchema],
});

export default mongoose.model<IDroppin>('Droppin', DroppinSchema);
