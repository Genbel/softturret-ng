// Invoke the 'strict' mode of Javascript
'use strict';

// Charge moongose module
var mongoose = require('mongoose'),
    CryptoJS = require('crypto-js');

// Charge Scheme Object
var Schema = mongoose.Schema;

// Define new 'UserSchema'
var UserSchema = new Schema({

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
    istremerid: {
        type: Number
    },
    /*company: {
        type: String
    },*/
    email:{ 
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
        unique:true
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

    widgets: [ { type: Schema.Types.ObjectId, ref: 'Widget'} ]
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
UserSchema.methods.hashPassword = function(password, dbSalt) {

    var iterations = 1000;
    // sizes must be a multiple of 32
    var keySize = 256;
    var ivSize = 128;
    //var salt = CryptoJS.lib.WordArray.random(128/8);

    var output = CryptoJS.PBKDF2(password, dbSalt, {
        keySize: (keySize+ivSize)/32,
        iterations: iterations
    });

    // the underlying words arrays might have more content than was asked: remove insignificant words
    output.clamp();

    // split key and IV
    var key = CryptoJS.lib.WordArray.create(output.words.slice(0, keySize/32));
    //var iv = CryptoJS.lib.WordArray.create(output.words.slice(keySize/32));

    key = key.toString(CryptoJS.enc.Base64);

    return key;
};

// Authenticate the user
UserSchema.methods.authenticate = function(password) {
    // 'this' is the object that it calls to that function
    return this.password === this.hashPassword(password, this.salt);
};

// 

// Define a model 'User' from UserSchema.
// The name that we set here, it will be the name of the collection on the database.
// Set the model name singular because after the collection name will be 'name'+s so it would be names
// After each collection will have user documents.
mongoose.model('User', UserSchema);