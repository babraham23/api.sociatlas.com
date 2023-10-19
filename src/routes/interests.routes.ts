module.exports = function (app: any) {
    const interests = require('../controllers/interests.controller');

    // createInterest
    app.post('/api/interests/createInterest', interests.createInterest);

    // getMostUsedInterests
    app.get('/api/interests/getMostUsedInterests', interests.getMostUsedInterests);

    // checkInterestAvailability
    app.post('/api/interests/checkInterestAvailability', interests.checkInterestAvailability);

    // getInterestsByCreator
    app.get('/api/interests/getInterestsByCreator/:userId', interests.getInterestsByCreator);
};
