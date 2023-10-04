import mongoose, { Document, Schema } from 'mongoose';

// Define the event interests subdocument schema
const InterestSchema = new Schema({
    icon: String,
    title: String,
    id: Number,
});

// Define the location subdocument schema
const LocationSchema = new Schema({
    address: String,
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere',
    },
});

LocationSchema.index({ latitude: 1, longitude: 1 }, { background: true });

// Define the organizer subdocument schema
const OrganizerSchema = new Schema({
    name: String,
    avatar: String,
    _id: String,
    username: String
});

// Define the main event schema
const EventSchema = new Schema({
    id: String,
    title: String,
    description: String,
    date: Number,
    maxCapacity: Number,
    currentAttendees: Number,
    interests: [InterestSchema],
    location: { type: LocationSchema, required: true },
    image: String,
    video: String, // Assuming the video is stored as a URL
    organizer: OrganizerSchema,
    price: Number,
    additionalInfo: String,
});

// Create and export the Event model
export interface IEvent extends Document {
    id: string;
    title: string;
    description: string;
    date: number;
    maxCapacity: number;
    currentAttendees: number;
    interests: {
        icon: string;
        title: string;
        id: number;
    }[];
    location: {
        address: string;
        coordinates: number[]; // Changed from latitude and longitude to coordinates array
    };
    image: {
        url: String; // URL of the image in blob storage
        eventId: Schema.Types.ObjectId; // Reference to the associated event
    };
    video: {
        url: String; // URL of the video in blob storage
        eventId: Schema.Types.ObjectId; // Reference to the associated event
    };
    organizer: {
        name: string;
        _id: string;
        avatar: string;
        username: string;
    };
    price: number;
    additionalInfo: string;
}

export const EventModel = mongoose.model<IEvent>('Event', EventSchema);
