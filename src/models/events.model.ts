import mongoose, { Schema, Document } from 'mongoose';

interface Interest extends Document {
    _id: string | number;
    createdBy: string;
    icon: string;
    image: string;
    title: string;
    selected: number;
    hidden?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    totalSelected?: number;
    __v?: number;
}

interface Invitee extends Document {
    _id: number;
    name: string;
    username: string;
    profilePic: string;
}

interface Organizer extends Document {
    _id: string;
    name: string;
    username: string;
}

interface Event extends Document {
    title: string;
    description: string;
    date: number;
    location: {
        address: string;
        coordinates: [number, number];
    };
    interests: Interest[];
    image: string;
    isPrivate: boolean;
    invitees: Invitee[];
    additionalInfo: string;
    maxCapacity: number;
    price: number;
    currentAttendees: string[];
    likedBy: string[];
    organizer: Organizer;
}

const InterestSchema = new Schema<Interest>({
    _id: Schema.Types.Mixed,
    createdBy: String,
    icon: String,
    image: String,
    title: String,
    selected: Number,
    hidden: Boolean,
    createdAt: Date,
    updatedAt: Date,
    totalSelected: Number,
    __v: Number,
});

const InviteeSchema = new Schema<Invitee>({
    _id: Number,
    name: String,
    username: String,
    profilePic: String,
});

const OrganizerSchema = new Schema<Organizer>({
    _id: String,
    name: String,
    username: String,
});

const LocationSchema = new Schema({
    address: String,
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
    },
});

const EventSchema = new Schema<Event>({
    title: String,
    description: String,
    date: Number,
    location: { type: LocationSchema, required: true },
    interests: [InterestSchema],
    image: String,
    isPrivate: Boolean,
    invitees: [InviteeSchema],
    additionalInfo: String,
    maxCapacity: Number,
    price: Number,
    currentAttendees: [String],
    likedBy: [String],
    organizer: OrganizerSchema,
});

export const EventModel = mongoose.model<Event>('Event', EventSchema);
