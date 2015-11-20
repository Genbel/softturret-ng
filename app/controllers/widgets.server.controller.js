'use strict'

var Widget = require('../models/widget.server.model');

exports.addWidget = function(req, res){

    /*var userId = '564da330e801c57c031756d1';
    console.log(req.body);
    console.log(req.user._id);*/
    res.status(200).json(req.body);
};