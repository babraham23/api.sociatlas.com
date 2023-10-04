// creat route for events

module.exports = function (app: any) {
    const events = require('../controllers/events.controller');
    const documents = require('../controllers/documents.controller');

    // Create a new event
    app.post('/api/events/createEvent', events.createEvent);

    // Get all events
    app.get('/api/events/getAllEvents', events.getAllEvents);

    // Get events within a certain distance
    app.post('/api/events/getEventsNearby', events.getEventsNearby);

    // Return all interest
    app.get('/api/events/getAllInterests', events.getAllInterests);

    // Post image from document
    app.post('/api/events/uploadImageToBlob', documents.uploadImageToBlob);

    // deleteImageFromBlob
    app.delete('/api/events/deleteImageFromBlob/:blobName', documents.deleteImageFromBlob);
};


