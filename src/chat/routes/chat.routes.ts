module.exports = function (app: any) {
    const chat = require('../controllers/chatroom.controller');

    // Chat room 
    // app.get('/api/chatrooms', chat.getChatRooms);

    // getUserChatRooms
    app.get('/api/getUserChatRooms', chat.getUserChatRooms);
};
