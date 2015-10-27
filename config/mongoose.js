var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);
    // Charge our 'User' model
    require('../app/models/users.server.model');
    // Return the mongoose database instance
    return db;
};