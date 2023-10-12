import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from '../models/user.model';
import jwt from 'jsonwebtoken';

let secretKey = 'sociatlas';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user: IUser = new UserModel({
            ...req.body,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        // Generate JWT token with embedded userId
        const token = jwt.sign({ userId: savedUser._id }, secretKey, {
            expiresIn: '7d', // Expires in 7 days
        });

        res.status(201).json({ user: savedUser, token }); // Return the user and the token
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            const user: any = await UserModel.findOne({ email }).select('+password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return res.status(401).json({ error: 'Invalid password' });

            // Generate JWT Token
            const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

            // Remove password from the user object before sending it
            user.password = undefined;

            return res.status(200).json({ message: 'Login successful', user, token });
        }

        return res.status(400).json({ error: 'Email and password must be provided' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while logging in' });
    }
};

export const loginUserWithToken = async (req: Request, res: Response) => {
    try {
        const bearerToken = req.headers.authorization;

        if (bearerToken && bearerToken.startsWith('Bearer ')) {
            const token = bearerToken.split(' ')[1];

            try {
                const decoded: any = jwt.verify(token, secretKey);
                const user = await UserModel.findById(decoded.userId).select('-password');

                if (!user) return res.status(404).json({ error: 'User not found' });

                return res.status(200).json({ message: 'Login successful', user });
            } catch (err) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
};

export const editUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { name, username, dateOfBirth, location, email, password, profilePic } = req.body;

        // Validate input - this might be more extensive based on your requirements
        if (password && password.trim().length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Ensure email format, and other fields validation as per your application logic...

        const updates: any = {};
        if (name) updates.name = name;
        if (username) updates.username = username;
        if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
        if (location) updates.location = location;
        if (email) updates.email = email;

        // Check if profilePic property exists in request body
        if ('profilePic' in req.body) {
            updates.profilePic = profilePic;
        }
        
        // If updating password, ensure it's hashed before saving
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const user = await UserModel.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};

export const checkUsernameAvailability = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;

        // Validate input - ensure the username is not empty, etc.
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const user = await UserModel.findOne({ username });

        if (user) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        res.status(200).json({ message: 'Username is available' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking username availability' });
    }
};
