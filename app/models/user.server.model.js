// Invoke the 'strict' mode of Javascript
'use strict';

// Charge moongose module
var mongoose = require('mongoose'),
    crypto = require('crypto');

// Charge Scheme Object
var Schema = mongoose.Schema;

// Define new 'UserSchema'
var UserSchema = new Schema({
    
    company: {
        type: String,
        unique:true
    },
    email:{ 
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        // Delete the spaces that we don't need
        trim: true
    },
    password: {
        type:String,
        // Validate password length
        validate: [
            function(password) {
                return password && password.length > 6;
            },
        ]
    },
    // To make the hash of our password
    salt: {
        type: String
    },
    created: {
        type: Date,
        // Create a default value
        default: Date.now
    },

    widgets: [ 'Widget' ]
});

// Use middleware to pre-save, to create the hash password
UserSchema.pre('save', function(next) {
    if(this.password) {
        // Random data to hash the password
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

// Create the password hash string
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('base64');
};

// Authenticate the user
UserSchema.methods.authenticate = function(password) {
    // 'this' is the object that it calls to that function
    return this.password === this.hashPassword(password);
};

// 

// Define a model 'User' from UserSchema.
// The name that we set here, it will be the name of the collection on the database.
// Set the model name singular because after the collection name will be 'name'+s so it would be names
// After each collection will have user documents.
mongoose.model('User', UserSchema);