import mongoose, { Document, Schema } from 'mongoose';

export interface IDroppin extends Document {
    title: string;
    description: string;
    startDate: number;
    coords: {
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
        title: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
    additionalInfo?: string;
}

const InterestSchema = new Schema({
    _id: Schema.Types.Mixed,
    title: String,
});

const CoordsSchema = new Schema({
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

const DroppinSchema = new Schema(
    {
        title: String,
        description: String,
        startDate: Number,
        coords: { type: CoordsSchema, required: true },
        droppin: String,
        createdBy: CreatorSchema,
        interests: [InterestSchema],
        additionalInfo: String,
    },
    { timestamps: true }
);

export default mongoose.model<IDroppin>('Droppin', DroppinSchema);
