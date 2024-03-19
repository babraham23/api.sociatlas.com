// routes.js

module.exports = function (app: any) {
    const chat = require('../controllers/chatgptmessage.controller');

    // Send Message to ChatGPT
    app.post('/api/chatgpt/sendChatMessage', chat.sendChatMessage);
};
