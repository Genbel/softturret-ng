'use strict'

var Widget  = require('mongoose').model('Widget'),
    User    = require('mongoose').model('User'),
    Button  = require('mongoose').model('Button'),
    Q       = require('q'),
    _       = require('underscore'),
    HashMap = require('hashmap'),
    server  = require('../../softturret'),
    connectionInstance = null;

exports.addWidget = function(req, res){

    var userId = req.user._id;

    var widgetSize = req.body.widgetSize;

    var newWidgetButtons = createNewWidget(widgetSize);

    var widget = new Widget({
        type: getWidgetType(widgetSize),
        name: req.body.name,
        buttons: newWidgetButtons
    });

    var tvaWidgetId = null;
    var circuitId = null;
    var asterixServerId = null;

    var poolConnection = server().mysqlPooldb;

    poolConnection.getConnection(function(err, connection) {
        if (err) {
            console.error('error connecting: ' + err.stack);
        } else {
            connectionInstance = connection;
            var values  = { RealWidgetID: widget._id, UserID: userId, WidgetName: req.body.name, CreatedDate: new Date() };
            connection.query('INSERT INTO Widgets SET ?', values, function(err, result) {
                if(err){
                    console.log(err);
                }else {
                    tvaWidgetId = result.insertId;
                    User.findById(userId, function(err, userData){
                        circuitId = userData.circuitId;
                        connection.query('SELECT C.AsterixServerID FROM Circuits as C WHERE C.CircuitID = ' + circuitId, function(err, circuitData){
                            asterixServerId = circuitData[0].AsterixServerID;
                            // Save information in the tva database
                            addWidgetInfoInTheTva(tvaWidgetId, asterixServerId, circuitId, widgetSize, widget, userId);
                            // Save information in the softturret database
                            User.findByIdAndUpdate(
                                userId,
                                { $push: { widgets: widget._id }},
                                { safe: true, upsert: true },
                                function(err, model) {
                                    widget.save(widget, function(callback){
                                        User.findOne({ _id: userId }, '-password -salt -_id -created').populate('widgets').exec(function(err, collection){
                                            if(err){
                                                return next(err);
                                            }
                                            var widgetsGroups = groupByTypeWidgets(collection);
                                            res.status(200).json({ "widgets": widgetsGroups});
                                        });
                                    });
                                }
                            );
                        });
                    });
                }
            });
        }
    });


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

var addWidgetInfoInTheTva = function(tvaWidgetId, asterixServerId, circuitId, widgetSize){
    createNewDialPlan(tvaWidgetId, asterixServerId, circuitId).then(function(newDialPlanId){
        createNewChannelAndItsDialPlanEnds(circuitId, newDialPlanId, widgetSize).then(function(){
            connectionInstance.release();
            connectionInstance = null;
        });
    });
};

var createNewDialPlan = function(tvaWidgetId, asterixServerId, circuitId){

    var widgetActionDeferred = Q.defer();

    var insertedData = { AsterixServerID: asterixServerId, CircuitID: circuitId, WidgetID: tvaWidgetId, CreatedDate: new Date() };

    connectionInstance.query('INSERT INTO DialPlans SET ?', insertedData, function(err, result){
        if(err){
            console.log(err);
            widgetActionDeferred.reject(err);
        } else {
            console.log("DialPlanID: " + result.insertId);
            widgetActionDeferred.resolve(result.insertId);
        }
    });
    return widgetActionDeferred.promise;
};

var createNewChannelAndItsDialPlanEnds = function(circuitId, newDialPlanId, widgetSize){

    var channelAndDialPlanEndsDeferred = Q.defer();

    _.times(widgetSize, function(n){
        var insertDataChannel = { CircuitID: circuitId, ChannelTypeID: 0, Number: n + 1, CreatedDate: new Date(), Version: 0.2 };
        connectionInstance.query('INSERT INTO Channels SET ?', insertDataChannel, function(err, channelResult){
            if(!err){
                console.log("Channel Added");
                //var channelId = channelResult.insertId;
                var insertDataDialPlanEnds = { DialPlanID: newDialPlanId, AChannelID: channelResult.insertId, MUserID: 1, CreatedDate: new Date() };
                connectionInstance.query('INSERT INTO DialPlanEnds SET ?', insertDataDialPlanEnds, function(err, result){
                    // Error control
                    console.log("DialPlanEndAdd");
                    // If we not set up that it will release connection and we will get a error
                    // because NodeJS is asynchronous language
                    if(n+1 === widgetSize){
                        channelAndDialPlanEndsDeferred.resolve(1);
                    }
                })
            }
        });
    });
    return channelAndDialPlanEndsDeferred.promise;
}

var groupByTypeWidgets = function(widgets){
    var widgetsJson = widgets.toJSON();
    var widgetsGroups = _.chain(widgetsJson.widgets).groupBy("type");
    return widgetsGroups;
};

// Create new map of the buttons that are in the widget
var createNewWidget = function(widgetSize) {

    //var total = calculateTotalChannel(type);

    var channels = [];

    _.times(widgetSize, function(n){

        var button = new Button({
            "position"          : n + 1,
            "private"           : true,
            "username"          : null,
            "remoteUserId"      : null,
            "remoteUserType"    : null,
            "licenceId"         : null,
            "dirNo"             : null,
            "tag"               : null
        });
        channels.push(button);
    });

    return channels;


};

// Get the number of channels that has to create depending of type of widget
var getWidgetType = function(type) {

    switch (type){
        case 8:
            return 'small';
        case 16:
            return 'big';
        case 2:
            return 'smallGroup';
    }
};