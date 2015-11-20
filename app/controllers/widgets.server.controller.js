'use strict'

var Widget = require('mongoose').model('Widget'),
    User = require('mongoose').model('User');

exports.addWidget = function(req, res){

    var widget = new Widget({
        type: 'Big'
    });

    var userId = '564da330e801c57c031756d1';

    User.findByIdAndUpdate(
        userId,
        { $push: { widgets: widget._id }},
        { safe: true, upsert: true },
        function(err, model) {
            console.log('User updated');
            widget.save(widget, function(callback){
                User.findOne({ _id: userId }, '-password -salt -_id -created').populate('widgets').exec(function(err,collection){
                    if(err){
                        //return next(err);
                        console.log(err);
                    }
                    res.status(200).json(collection.toJSON());
                });
            });

        }
    );
};

exports.getUserConfiguration = function(req, res){

    var userId = req.user._id;

    User.findById(userId).populate('widgets').exec(function(error,response){
        res.status(200).json(req.body);
    });
};