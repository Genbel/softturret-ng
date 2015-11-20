// Invoke the 'strict' mode of Javascript
'use strict';

// Charge moongose module
var mongoose = require('mongoose');
// Charge Scheme Object
var Schema = mongoose.Schema;

// Define a bew 'ButtonSchema'
var ButtonSchema = new Schema({

    position: Number,

    private: Boolean,

    Username: String
});

// Define new 'WidgetSchema'
var WidgetSchema = new Schema({

    type: String,

    buttons: [ ButtonSchema ]
});

// Define a model 'Widget' from WidgetSchema.
// The name that we set here, it will be the name of the collection on the database.
// Set the model name singular because after the collection name will be 'name'+s so it would be names
// The children of each collection will have a documents.
mongoose.model('Widget', WidgetSchema);