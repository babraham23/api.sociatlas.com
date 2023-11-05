module.exports = function (app: any) {
    const chat = require('../controllers/chat.controller');

    // Chat room 
    app.get('/api/chatrooms', chat.getChatRooms);
};
