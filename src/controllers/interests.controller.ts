import { Request, Response } from 'express';
import { InterestModel, IInterest } from '../models/interests.model'; // Ensure correct import path
import { EventModel } from '../models/events.model';

export const createInterest = async (req: Request, res: Response) => {
    try {
        // Extract interest data from the request body
        const interestData: IInterest = req.body;

        // Validate the interest data (Add additional validation as needed)
        if (!interestData.createdBy || !interestData.image || !interestData.interest) {
            return res.status(400).json({ error: 'Required fields: createdBy, image, and interest' });
        }

        // Create a new interest using the Interest model
        const newInterest = new InterestModel(interestData);

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

// export const getMostUsedInterests = async (req: Request, res: Response) => {
//     try {
//         // Retrieve all interests, ordered by the 'selected' field in descending order
//         const interests = await InterestModel.find().sort({ selected: -1 }).exec();

//         // Respond with the retrieved interests data
//         res.status(200).json(interests);
//     } catch (error) {
//         // Handle any errors that occur during the retrieval process
//         console.error('Error retrieving interests:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

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
                    selected: { $first: '$interests.selected' }
                }
            },
            { $sort: { totalSelected: -1 } }
        ]);

        res.status(200).json(mostUsedInterests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
