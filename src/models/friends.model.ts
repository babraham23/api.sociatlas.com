import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.model';

const FriendInvitationSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending',
        },
    },
    {
        timestamps: true, // To automatically add createdAt and updatedAt timestamps
    }
);

export interface IFriendInvitation extends Document {
    sender: IUser['_id'];
    receiver: IUser['_id'];
    status: 'pending' | 'accepted' | 'declined';
}

export const FriendInvitationModel = mongoose.model<IFriendInvitation>('FriendInvitation', FriendInvitationSchema);
