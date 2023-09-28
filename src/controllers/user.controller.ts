import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from '../models/user.model';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the saltRounds
        const user: IUser = new UserModel({
            ...req.body,
            password: hashedPassword,
        });

        const result = await user.save();
        res.status(200).json(result); // Return the userId of the created user
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        let user;

        // Case 1: Login with email and password
        if (req.body.email && req.body.password) {
            user = await UserModel.findOne({ email: req.body.email }).select('+password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatch) return res.status(401).json({ error: 'Invalid password' });
        }
        // Case 2: Login with userId
        else if (req.body.userId) {
            user = await UserModel.findById(req.body.userId);
            if (!user) return res.status(404).json({ error: 'User not found' });
        }
        // Case 3: Neither email and password nor userId provided
        else {
            return res.status(400).json({ error: 'Either email and password or userId must be provided' });
        }

        // At this point, the user is authenticated. Here you typically generate and return a JWT or another form of token.
        res.status(200).json({ message: 'Login successful', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
};
