import mongoose, { Document, Schema } from 'mongoose';
// import validator from 'validator'; // for validating the email

// Define the User schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    city: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: {
        //     validator: validator.isEmail,
        //     message: 'Not a valid email address',
        // },
        lowercase: true,
        trim: true,
    },
    phonenumber: {
        type: String,
        required: false,
        unique: false,
        trim: true,
    },
    profilePic: {
        type: String,
        trim: true, // to remove any unnecessary whitespace
        default: null, // default value if no URL is provided
    },
    password: {
        type: String,
        required: true,
        select: false, // By default don't return passwords
    },
    dateOfBirth: {
        type: Date,
        required: true, // set to false if it's optional
    },
});

// Create and export the User model
export interface IUser extends Document {
    name: string;
    username: string;
    city: string;
    email: string;
    phonenumber: string;
    profilePic: string | null;
    password: string;
    dateOfBirth: Date;
}

export const UserModel = mongoose.model<IUser>('User', UserSchema);
