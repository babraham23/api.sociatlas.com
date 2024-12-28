import { Request, Response } from 'express';
import droppinModel from '../models/droppin.model';
import { errorResponse, successResponse } from '../utils/response.class';

// Controller to create a new Droppin
export const createDroppin = async (req: Request, res: Response): Promise<void> => {
    console.log('Creating Droppin:', req.body);
    try {
        const { title, description, startDate, coords, droppin, createdBy, interests, additionalInfo } = req.body;

        const newDroppin = new droppinModel({
            title,
            description,
            startDate,
            coords,
            droppin,
            createdBy,
            interests,
            additionalInfo,
        });

        const savedDroppin = await newDroppin.save();

        res.status(201).json(successResponse(savedDroppin));
    } catch (error) {
        res.status(500).json(errorResponse((error as any).message));
    }
};

// Get dropins by radius and interest
export const getDroppins = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, interestTitle, maxDistance, droppin } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json(errorResponse('Missing latitude or longitude parameters'));
        }

        let query: any = {
            'coords.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(latitude as string), parseFloat(longitude as string)],
                    },
                    $maxDistance: maxDistance ? parseFloat(maxDistance as string) : 16093.4,
                },
            },
        };

        if (interestTitle) {
            query['interests.title'] = { $regex: new RegExp(`^${interestTitle}$`, 'i') };
        }

        if (droppin) {
            query['droppin'] = droppin;
        }

        const droppins = await droppinModel.find(query);

        res.status(200).json(successResponse(droppins));
    } catch (error: any) {
        console.error('Error fetching nearby droppins:', error);
        res.status(500).json(errorResponse('Internal Server Error', error.message));
    }
};

// Controller to get all droppins sorted by the most used interest
export const getDroppinsByMostUsedInterest = async (req: Request, res: Response): Promise<void> => {
    try {
        const droppins = await droppinModel.aggregate([
            { $unwind: '$interests' }, // Unwind the interests array
            {
                $group: {
                    _id: {
                        id: '$interests._id',
                        icon: '$interests.icon',
                        image: '$interests.image',
                        title: '$interests.title',
                        hidden: '$interests.hidden',
                    }, // Group by interest details
                    count: { $sum: 1 }, // Count occurrences of each interest
                },
            },
            { $sort: { count: -1 } }, // Sort by count in descending order
            {
                $project: {
                    _id: '$_id.id',
                    icon: '$_id.icon',
                    image: '$_id.image',
                    title: '$_id.title',
                    hidden: '$_id.hidden',
                    count: 1,
                },
            },
        ]);

        res.status(200).json(successResponse(droppins));
    } catch (error: any) {
        console.error('Error fetching droppins by most used interest:', error);
        res.status(500).json(errorResponse('Internal Server Error', error.message));
    }
};
