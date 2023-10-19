import mongoose, { Document, Schema } from 'mongoose';

// Define the event interests subdocument schema
const InterestSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // assuming you have a User model
        required: true,
    },
    icon: { type: String, required: false },
    image: { type: String, required: false },
    title: { type: String, required: true },
    selected: { type: Number, default: 0 },
});

// Define the location subdocument schema
const LocationSchema = new Schema({
    address: String,
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
    },
});

// Define the organizer and invitee subdocument schema
const PersonSchema = new Schema({
    _id: Schema.Types.Mixed, // To accommodate both string and number types
    name: String,
    username: String,
    profilePic: String,
});

// Define the main event schema
const EventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Number, required: true },
    location: { type: LocationSchema, required: true },
    interests: [InterestSchema],
    image: String,
    isPrivate: Boolean,
    invitees: [PersonSchema],
    additionalInfo: String,
    maxCapacity: { type: Number, required: true },
    price: { type: Number, required: true },
    currentAttendees: [PersonSchema],
    likedBy: [Schema.Types.Mixed], // To accommodate both string and number types
    organizer: { type: PersonSchema, required: true }, // Adjusted to be an object and renamed
});

export interface IEvent extends Document {
    title: string;
    description: string;
    date: number;
    location: {
        address: string;
        coordinates: number[];
    };
    interests: {
        createdBy: string; // MongoDB ObjectId is typically a string
        icon: string;
        image: string;
        title: string;
        selected: number;
    }[];
    image: string;
    isPrivate: boolean;
    invitees: {
        _id: string | number;
        name: string;
        username: string;
        profilePic: string;
    }[];
    additionalInfo: string;
    maxCapacity: number;
    price: number;
    currentAttendees: {
        _id: string | number;
        name: string;
        username: string;
        profilePic: string;
    }[];
    likedBy: (string | number)[];
    organizer: {
        // Adjusted and renamed
        _id: string | number;
        name: string;
        username: string;
        profilePic: string;
    };
}

export const EventModel = mongoose.model<IEvent>('Event', EventSchema);
