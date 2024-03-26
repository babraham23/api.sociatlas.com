module.exports = function (app: any) {
    const chat = require('../controllers/chatroom.controller');
    const locationChat = require('../controllers/locationChatroom.controller');

    // getUserChatRooms
    app.get('/api/chat/getUserChatRooms', chat.getUserChatRooms);

    // createLocationChatRoom
    app.post('/api/chat/createLocationChatRoom', locationChat.createLocationChatRoom);

    // getLocationChatRooms
    app.post('/api/chat/getLocationChatRooms', locationChat.getLocationChatRooms);
};
