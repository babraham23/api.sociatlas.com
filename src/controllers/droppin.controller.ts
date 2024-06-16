import { Request, Response } from 'express';
import { DroppinModel } from '../models/droppin.model';

// Create a droppin
export const createDroppin = async (req: Request, res: Response) => {
    console.log('createDroppin', req.body);
    try {
        // Extract droppin data from the request body
        const droppinData = req.body;

        // Validate the droppin data
        if (!droppinData.droppin) {
            return res.status(400).json({ error: 'Droppin is required' });
        }

        if (!droppinData.coordinates || typeof droppinData.coordinates.latitude !== 'number' || typeof droppinData.coordinates.longitude !== 'number') {
            return res.status(400).json({ error: 'Coordinates with latitude and longitude are required' });
        }

        // Create a new droppin using the Droppin model
        const newDroppin = new DroppinModel(droppinData);

        // Save the droppin to the database
        const savedDroppin = await newDroppin.save();

        // Respond with the saved droppin data
        res.status(200).json(savedDroppin);
    } catch (error) {
        // Handle any errors that occur during the creation process
        console.error('Error creating droppin:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllDroppins = async (req: Request, res: Response) => {
    try {
        // Fetch all droppins from the database
        const droppins = await DroppinModel.find();

        // Respond with the list of droppins in JSON format
        res.status(200).json(droppins);
    } catch (error) {
        // Handle any errors that occur during the fetch process
        console.error('Error fetching droppins:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
