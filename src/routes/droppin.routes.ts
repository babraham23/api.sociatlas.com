module.exports = function (app: any) {
    const droppins = require('../controllers/droppin.controller');

    // Create a droppin
    app.post('/api/droppin/createDroppin', droppins.createDroppin);

    // // getDroppinsWithinRadius
    app.post('/api/droppin/getDroppins', droppins.getDroppins);

    // getDroppinsByMostUsedInterest
    app.get('/api/droppin/getDroppinsByMostUsedInterest', droppins.getDroppinsByMostUsedInterest);
};
