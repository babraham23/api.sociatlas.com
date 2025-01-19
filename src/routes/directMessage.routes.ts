module.exports = function (app: any) {
    const directMessages = require('../controllers/directMessage.controller');

    // Get user direct mssages rooms
    app.get('/api/directMessages/getUsersDirectMessageRooms', directMessages.getUsersDirectMessageRooms);
};
