module.exports = function (app: any) {
    const interests = require('../controllers/interests.controller');

    // Create a new interest
    app.post('/api/interests/createInterest', interests.createInterest);

    // return interest by id, date or order
    app.get('/api/interests/getInterests', interests.getInterests);

    // getMostUsedInterests
    app.get('/api/interests/getMostUsedInterests', interests.getMostUsedInterests);
};

// "title": "Grainer Market",
// "description": "Located in the heart of Newcastle upon Tyne, Grainger Market has been an important part of the city’s shopping experience for almost two centuries. Built in 1835, the Grade I listed building is a popular traditional indoor market offering a huge range of products. It is home to over 100 small businesses and self employed independent traders. Alongside craft stalls, mini bazaars, jewellers, clothing and plant stalls, you'll find high quality butchers, artisan bakers, green grocers, street food traders, coffee shops and cafés. There's something for everyone.",
// {"latitude": 54.97284867367049, "longitude": -1.6149691806011888}
// {"latitude": 54.96744594994282, "longitude": -1.6207429170762866}
