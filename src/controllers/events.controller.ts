import { Request, Response } from 'express';
import { EventModel, IEvent } from '../models/events.model';

// Create an event
export const createEvent = async (req: Request, res: Response) => {
    try {
        // Extract event data from the request body
        const eventData: IEvent = req.body;

        // Validate the location object
        if (!eventData.location || !eventData.location.coordinates || eventData.location.coordinates.length !== 2) {
            return res.status(400).json({ error: 'Invalid location data' });
        }

        // Create a new event using the Event model
        const newEvent = new EventModel(eventData);

        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Respond with the saved event data
        res.status(201).json(savedEvent);
    } catch (error) {
        // Handle any errors that occur during the creation process
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        // Fetch all events from the database
        const events = await EventModel.find();

        // Respond with the list of events in JSON format
        res.status(200).json(events);
    } catch (error) {
        // Handle any errors that occur during the fetch process
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Pass maxDistanceMeters as a query parameter
export const getEventsNearby = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude } = req.body;
        console.log('latitude', latitude);
        console.log('longitude', longitude);

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Missing latitude or longitude parameters' });
        }

        const events = await EventModel.find({
            'location.coordinates': {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)],
                    },
                    $maxDistance: 16093.4, // 10 miles in meters
                },
            },
        });

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching nearby events:', error);
        // res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
