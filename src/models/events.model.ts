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
        index: '2dsphere'
    },
});

LocationSchema.index({ latitude: 1, longitude: 1 }, { background: true });


// Define the organizer subdocument schema
const OrganizerSchema = new Schema({
    name: String,
    email: String,
    avatar: String,
});

// Define the social media subdocument schema
const SocialMediaSchema = new Schema({
    facebook: String,
    twitter: String,
    instagram: String,
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
    socialMedia: SocialMediaSchema,
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
        coordinates: number[];  // Changed from latitude and longitude to coordinates array
    };
    image: string;
    video: string;
    organizer: {
        name: string;
        email: string;
        avatar: string;
    };
    price: number;
    socialMedia: {
        facebook: string;
        twitter: string;
        instagram: string;
    };
    additionalInfo: string;
}


export const EventModel = mongoose.model<IEvent>('Event', EventSchema);
