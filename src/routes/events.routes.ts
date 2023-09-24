// creat route for events

module.exports = function (app: any) {
    const events = require('../controllers/events.controller');

    // Create a new event
    app.post('/api/createEvent', events.createEvent);

    // Get all events
    app.get('/api/getAllEvents', events.getAllEvents);

    // Get events within a certain distance
    app.post('/api/getEventsNearby', events.getEventsNearby);

    // Return all interest
    app.get('/api/getAllInterests', events.getAllInterests);
};
