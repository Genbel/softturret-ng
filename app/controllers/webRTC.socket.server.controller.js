'use strict';

exports.init = function(){
    console.log('socket init');
};

exports.welcome = function(message) {
    console.log(message + ' in our server');
    return 'controller respond for socket';
};