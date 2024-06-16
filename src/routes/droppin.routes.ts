module.exports = function (app: any) {
    const droppins = require('../controllers/droppin.controller');

    // Create a droppin
    app.post('/api/droppin/createDroppin', droppins.createDroppin);
};
