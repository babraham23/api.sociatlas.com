import { Request, Response } from 'express';
import { IInterest, InterestModel } from '../models/interests.model';

export const createInterest = async (req: Request, res: Response) => {
    try {
        // Destructure fields from request body
        const { icon, title, id, likeCount } = req.body;

        // Validate required fields
        if (!icon || !title || id === undefined) {
            return res.status(400).json({ error: 'icon, title, and id are required fields.' });
        }

        // Create a new Interest
        const newInterest: IInterest = new InterestModel({
            icon,
            title,
            id,
            likeCount: likeCount || 0, // If likeCount is not provided, default to 0
        });

        // Save the Interest to the database
        await newInterest.save();

        // Respond with the created Interest
        return res.status(201).json(newInterest);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating interest.' });
    }
};

export const getInterests = async (req: Request, res: Response) => {
    try {
        const { id, order } = req.query;
        const date = typeof req.query.date === 'string' ? req.query.date : undefined;

        // Build the query object
        let query: any = {};
        if (id) query.id = id;
        if (date) query.date = { $gte: new Date(date) };

        // Define the sort object
        // Define the sort object
        let sortObj: any = {};
        if (order && order === 'mostLiked') sortObj.likeCount = -1; // Sort by likeCount in descending order
        else if (order && order === 'id') sortObj.id = 1; // Sort by id in ascending order
        else sortObj.date = -1; // Default sort by date in descending order

        const interests = await InterestModel.find(query).sort(sortObj);

        return res.status(200).json(interests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching interests' });
    }
};
