'use strict'

var Widget  = require('mongoose').model('Widget'),
    User    = require('mongoose').model('User'),
    Button  = require('mongoose').model('Button'),
    q       = require('q'),
    _       = require('underscore'),
    HashMap = require('hashmap');

exports.addWidget = function(req, res){

    var newWidgetButtons = createNewWidget('small');

    var widget = new Widget({
        type: 'small',
        buttons: newWidgetButtons
     });

    //console.log(req.user);

    var userId = req.user._id;

    User.findByIdAndUpdate(
        userId,
        { $push: { widgets: widget._id }},
        { safe: true, upsert: true },
        function(err, model) {
            console.log('User updated');
            widget.save(widget, function(callback){
                User.findOne({ _id: userId }, '-password -salt -_id -created').populate('widgets').exec(function(err, collection){
                    if(err){
                        //return next(err);
                        console.log(err);
                    }
                    var widgetsGroups = groupByTypeWidgets(collection);
                    res.status(200).json({ "widgets": widgetsGroups});
                });
            });

        }
    );
};

// Get user configuration of the softurret
exports.getUserConfiguration = function(req, res){

    // The user already is logged so we can get the id of the user using passport
    var userId = req.user._id;
    User.findOne({ _id: userId }, '-password -salt -_id -created -v').populate('widgets').exec(function(error, userWidgets){
        var widgetsGroups = groupByTypeWidgets(userWidgets);
        //var widgetsHashMap = createConfigurationHashMap(widgetsGroups);
        // @widgets: User widget configuration
        // @user: Actual user info
        res.status(200).json({
            "authenticated": true,
            "widgets": widgetsGroups,
            "user": { "username": req.user.username, "_id": userId }
        });
    });
};

exports.attachUserToChannel = function(req, res){
    console.log(req.body);
    // $ will save position of matched document.
    Widget.update(
        // Conditions
        {_id : req.body.widgetId, 'buttons._id': req.body.buttonId},
        // Variables to update
        {'buttons.$.username' : req.body.username, 'buttons.$.userId': req.body.userId},
        // Callback
        function(err,result){
            if(err){
                console.log(err);
            }
            res.sendStatus(200);
        }
    );
};

var groupByTypeWidgets = function(widgets){
    var widgetsJson = widgets.toJSON();
    var widgetsGroups = _.chain(widgetsJson.widgets).groupBy("type");
    return widgetsGroups;
};

// Create new map of the buttons that are in the widget
var createNewWidget = function(type) {

    var total = calculateTotalChannel(type);

    var channels = [];

    _.times(total,function(n){

        var button = new Button({
            "position"  : n + 1,
            "private"   : false,
            "username"  : null,
            "userId"    : null
        });
        channels.push(button);
    });

    return channels;


};

// Get the number of channels that has to create depending of type of widget
var calculateTotalChannel = function(type) {

    switch (type){
        case 'small':
            return 8;
        case 'big':
            return 16;
        case 'smallGroup':
            return 8;
    }
};