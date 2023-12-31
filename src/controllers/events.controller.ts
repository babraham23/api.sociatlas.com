import { Request, Response } from 'express';
import { EventModel } from '../models/events.model';

// Create an event
export const createEvent = async (req: Request, res: Response) => {
    console.log('createEvent', req.body);
    try {
        // Extract event data from the request body
        const eventData = req.body;

        // Validate the location object
        if (!eventData.location || !eventData.location.coordinates || eventData.location.coordinates.length !== 2) {
            return res.status(400).json({ error: 'Invalid location data' });
        }

        // Create a new event using the Event model
        const newEvent = new EventModel(eventData);

        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Respond with the saved event data
        res.status(200).json(savedEvent);
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

export const getEventsNearby = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, interestTitle, maxDistance } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Missing latitude or longitude parameters' });
        }

        let query: any = {
            'location.coordinates': {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)],
                    },
                    $maxDistance: maxDistance, // 10 miles in meters
                },
            },
        };

        if (interestTitle) {
            query['interests.title'] = new RegExp(interestTitle, 'i');
        }

        const events = await EventModel.find(query);

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching nearby events:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
};

export const getAllInterests = async (req: Request, res: Response) => {
    try {
        // Use the aggregation framework to group and sort the interests
        const aggregatedInterests = await EventModel.aggregate([
            { $unwind: '$interests' },
            {
                $group: {
                    _id: '$interests.title',
                    count: { $sum: 1 },
                    icon: { $first: '$interests.icon' },
                    id: { $first: '$interests.id' },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Format the aggregated results to match the expected output
        const formattedInterests = aggregatedInterests.map((interest) => ({
            title: interest._id,
            count: interest.count,
            icon: interest.icon,
            id: interest.id,
        }));

        return res.status(200).send(formattedInterests);
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred', error });
    }
};
