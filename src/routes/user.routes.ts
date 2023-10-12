module.exports = function (app: any) {
    const user = require('../controllers/user.controller');

    // Register User
    app.post('/api/user/registerUser', user.registerUser);

    // User login
    app.post('/api/user/loginUser', user.loginUser);

    // Login user with bearer token
    app.post('/api/user/loginUserWithToken', user.loginUserWithToken);

    // edit user
    app.put('/api/user/editUser/:id', user.editUser);

    // check user name availability
    app.post('/api/user/checkUsernameAvailability', user.checkUsernameAvailability);
};