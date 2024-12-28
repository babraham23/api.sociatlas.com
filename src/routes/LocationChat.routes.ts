module.exports = function (app: any) {
    const locationChat = require('../controllers/locationChatroom.controller');

    // createLocationChatRoom
    app.post('/api/chat/createLocationChatRoom', locationChat.createLocationChatRoom);

    // getLocationChatRooms
    app.post('/api/chat/getLocationChatRooms', locationChat.getLocationChatRooms);
};

