module.exports = function (app: any) {
    const user = require('../controllers/user.controller');

    // Register User
    app.post('/api/user/registerUser', user.registerUser);

    // User login
    app.post('/api/user/loginUser', user.loginUser);
};