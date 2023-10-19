import { Request, Response } from 'express';
import { InterestModel, IInterest } from '../models/interests.model'; // Ensure correct import path
import { EventModel } from '../models/events.model';

export const createInterest = async (req: Request, res: Response) => {
    try {
        // Extract interest data from the request body
        const { createdBy, icon, image, title, selected, hidden }: IInterest = req.body;

        // Validate the interest data
        if (!createdBy || !title) {
            return res.status(400).json({ error: 'Required fields: createdBy, title' });
        }

        // Check if interest with the same title already exists
        const existingInterest = await InterestModel.findOne({ title });
        if (existingInterest) {
            return res.status(400).json({ error: 'Interest with this title already exists' });
        }

        // Create a new interest using the Interest model
        const newInterest = new InterestModel({
            createdBy,
            icon,
            image,
            title,
            selected,
            hidden,
        });

        // Save the interest to the database
        const savedInterest = await newInterest.save();

        // Respond with the saved interest data
        res.status(201).json(savedInterest);
    } catch (error) {
        // Handle any errors that occur during the creation process
        console.error('Error creating interest:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMostUsedInterests = async (req: Request, res: Response) => {
    try {
        const mostUsedInterests = await EventModel.aggregate([
            { $unwind: '$interests' },
            {
                $group: {
                    _id: '$interests.title',
                    totalSelected: { $sum: '$interests.selected' },
                    createdBy: { $first: '$interests.createdBy' },
                    icon: { $first: '$interests.icon' },
                    image: { $first: '$interests.image' },
                    title: { $first: '$interests.title' },
                    selected: { $first: '$interests.selected' },
                },
            },
            { $sort: { totalSelected: -1 } },
        ]);

        res.status(200).json(mostUsedInterests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkInterestAvailability = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        // Validate input - ensure the interest is not empty, etc.
        if (!title) {
            return res.status(400).json({ error: 'Interest title is required' });
        }

        // Case-insensitive search for the interest
        const interestExists = await InterestModel.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
        });

        if (interestExists) {
            return res.status(400).json({ error: 'This interest already exists' });
        }

        res.status(200).json({ message: 'Interest is available' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking interest availability' });
    }
};

export const getInterestsByCreator = async (req: Request, res: Response) => {
    try {
        // Extract userID from the request params or body
        const userId = req.params.userId || req.body.userId;

        // Validate the userId - Ensure it is not empty, etc.
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find interests from the database that match the createdBy field
        const interests = await InterestModel.find({ createdBy: userId });

        // Respond with the found interests
        res.status(200).json(interests);
    } catch (error) {
        // Handle any errors that occur during the query process
        console.error('Error getting interests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
