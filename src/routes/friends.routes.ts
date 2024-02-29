// Friend Request routes

module.exports = function (app: any) {
    const friends = require('../controllers/friends.controller');

    // inviteUserAsFriend
    app.post('/api/friends/inviteUserAsFriend', friends.inviteUserAsFriend);

    // respondToFriendRequest
    app.post('/api/friends/respondToFriendRequest', friends.respondToFriendRequest);

    // getAllFriendRequests
    app.get('/api/friends/getAllFriendRequests', friends.getAllFriendRequests);

    // getUserFriends
    app.get('/api/friends/getUserFriends', friends.getUserFriends);

    // removeFriend
    app.post('/api/friends/removeFriend', friends.removeFriend);
};
