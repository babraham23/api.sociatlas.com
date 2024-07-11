import { Request, Response } from 'express';
import droppinModel from '../models/droppin.model';
import { errorResponse, successResponse } from '../utils/response.class';

// Controller to create a new Droppin
export const createDroppin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, date, coords, droppin, createdBy, interests } = req.body;

        const newDroppin = new droppinModel({
            title,
            description,
            date,
            coords,
            droppin,
            createdBy,
            interests,
        });

        const savedDroppin = await newDroppin.save();

        res.status(201).json(successResponse(savedDroppin));
    } catch (error) {
        res.status(500).json(errorResponse((error as any).message));
    }
};

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
