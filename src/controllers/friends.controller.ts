import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { FriendInvitationModel } from '../models/friends.model';

export const inviteUserAsFriend = async (req: Request, res: Response) => {
    try {
        const { senderUserId, receiverUserId } = req.body; // Using user IDs instead of usernames

        // Find the sender and receiver in the database by their user IDs
        const sender = await UserModel.findById(senderUserId);
        const receiver = await UserModel.findById(receiverUserId);

        // Check if both users exist
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if an invitation already exists
        const existingInvitation = await FriendInvitationModel.findOne({
            sender: sender._id,
            receiver: receiver._id,
            status: 'pending',
        });

        if (existingInvitation) {
            return res.status(400).json({ message: 'Invitation already exists.' });
        }

        // Create a new friend invitation
        const newInvitation = new FriendInvitationModel({
            sender: sender._id,
            receiver: receiver._id,
            status: 'pending',
        });

        await newInvitation.save();
        res.status(201).json({ message: 'Invitation sent successfully.' });
    } catch (error) {
        console.error('Error in sending invitation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const respondToFriendRequest = async (req: Request, res: Response) => {
    try {
        const { senderUserId, receiverUserId, action } = req.body;

        if (!['accept', 'decline'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action.' });
        }

        const invitation = await FriendInvitationModel.findOne({
            sender: senderUserId,
            receiver: receiverUserId,
            status: 'pending',
        });

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found.' });
        }

        if (action === 'accept') {
            // Fetch user details
            const senderUser = await UserModel.findById(senderUserId, 'name username profilePic _id');
            const receiverUser = await UserModel.findById(receiverUserId, 'name username profilePic _id');

            // Add user details to each other's friends list
            await UserModel.findByIdAndUpdate(senderUserId, { $addToSet: { friends: receiverUser } });
            await UserModel.findByIdAndUpdate(receiverUserId, { $addToSet: { friends: senderUser } });

            res.status(200).json({ message: 'Friend request accepted successfully.' });
        } else {
            // For 'decline', just send a response as the invitation will be deleted
            res.status(200).json({ message: 'Friend request declined.' });
        }

        // Delete the invitation regardless of whether it was accepted or declined
        await FriendInvitationModel.findByIdAndRemove(invitation._id);
    } catch (error) {
        console.error(`Error in responding to friend request:`, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getAllFriendRequests = async (req: Request, res: Response) => {
    try {
        const receiverUserId = req.query.receiverUserId; // Getting the receiver's user ID from query parameters

        // Find all pending invitations for the receiver using their user ID
        const invitations = await FriendInvitationModel.find({
            receiver: receiverUserId,
            status: 'pending',
        }).populate('sender', 'name username profilePic _id'); // Populating with additional fields from the UserModel

        if (!invitations.length) {
            return res.status(404).json({ message: 'No friend requests found.' });
        }

        // Map the invitations to include only necessary data
        const mappedInvitations = invitations.map((invitation) => ({
            _id: invitation._id,
            sender: {
                _id: invitation.sender._id,
                name: invitation.sender.name,
                username: invitation.sender.username,
                profilePic: invitation.sender.profilePic,
            },
            status: invitation.status,
        }));

        res.status(200).json({ invitations: mappedInvitations });
    } catch (error) {
        console.error('Error in retrieving friend requests:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserFriends = async (req: Request, res: Response) => {
    try {
        // const { userId } = req.params; // Assuming the user's ID is passed as a URL parameter
        const { userId } = req.query; // Accessing userId as a query parameter


        // Find the user and populate the friends field
        const user = await UserModel.findById(userId).populate('friends', 'name username profilePic');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with the user's friends information
        res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error('Error in retrieving user friends:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const removeFriend = async (req: Request, res: Response) => {
    try {
        const { userId, friendId } = req.body; // Extracting userId and friendId from the request body

        // Find the user and the friend from the database
        const user = await UserModel.findById(userId);
        const friend = await UserModel.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found.' });
        }

        // Check if the friend ID is in the user's friends array
        if (!user.friends.includes(friendId)) {
            return res.status(404).json({ message: 'Friend not found in user\'s friend list.' });
        }

        // Check if the user ID is in the friend's friends array
        if (!friend.friends.includes(userId)) {
            return res.status(404).json({ message: 'User not found in friend\'s friend list.' });
        }

        // Remove the friend ID from the user's friends array
        user.friends = user.friends.filter(friend => friend.toString() !== friendId);

        // Remove the user ID from the friend's friends array
        friend.friends = friend.friends.filter(user => user.toString() !== userId);

        // Save the updated user and friend documents
        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friendship removed successfully.' });
    } catch (error) {
        console.error('Error in removing friendship:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
